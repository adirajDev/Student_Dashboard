import mongoose from 'mongoose';
import CollegeUpdate from './update.model.js';
import College from '../college.model.js';
import Course from '../../course/course.model.js';
import AppError from '../../../common/errors/AppError.js';
import { validateProposedChanges } from './update.validation.js';
import { applyProposedChanges } from './update.merge.js';
import { MAX_FAQS } from '../../../common/faq_feat/faq.constants.js';
import { slugify } from '../../../common/utils/slug.util.js';
import { assertUniqueFields } from '../college.service.js';
import { throwIfDuplicate } from '../college.error.js';

// Everything the review UI needs to render the "before" side of a diff.
// `images` is deliberately excluded: these queries use .lean(), which skips
// the toJSON transform in college.model.js that strips the raw buffers.
const COLLEGE_REVIEW_FIELDS = [
    'name',
    'slug',
    'city',
    'state',
    'type',
    'collegeId',
    'logo',
    'overview',
    'description',
    'placementDetails',
    'recruiters',
    'faculty',
    'availableCourses',
    'faqs',
].join(' ');

// Scalar fields worth snapshotting. Array/object fields are handled separately
// below because they need normalising before they are stored.
const SNAPSHOT_SCALARS = [
    'name',
    'slug',
    'type',
    'city',
    'state',
    'collegeId',
    'logo',
    'overview',
    'description',
    'placementDetails',
    'recruiters',
    'faculty',
];

// Capture the college's current values for exactly the fields this request
// touches. Stored on the request so the college-side history can still show a
// real before/after long after the change was approved and the live record
// moved on.
const buildSnapshot = (college, changes) => {
    const snapshot = {};

    for (const key of SNAPSHOT_SCALARS) {
        if (changes[key] !== undefined) {
            snapshot[key] = college[key] ?? null;
        }
    }

    if (changes.courseUpdates || changes.availableCourses) {
        snapshot.availableCourses = (college.availableCourses || []).map(
            ac => ({ course: String(ac.course), fee: ac.fee })
        );
    }

    if (changes.faqs) {
        snapshot.faqs = (college.faqs || []).map(f => ({
            _id: String(f._id),
            question: f.question,
            answer: f.answer,
            order: f.order,
        }));
    }

    return snapshot;
};

// Resolve every course id referenced by a courseUpdates delta, by the snapshot
// taken at submit time, and by the college's current list — so the review UI
// can name both sides of a fee change.
const attachCourseDetails = async docs => {
    for (const update of docs) {
        const cu = update.proposedChanges?.courseUpdates;
        if (!cu) continue;

        const ids = [
            ...(cu.added || []).map(a => a.course),
            ...(cu.updated || []).map(u => u.course),
            ...(cu.removed || []),
            ...(update.previousValues?.availableCourses || []).map(
                ac => ac.course
            ),
            ...(update.college?.availableCourses || []).map(ac => ac.course),
        ]
            .filter(Boolean)
            .map(String);

        if (ids.length === 0) continue;

        cu.populatedCourses = await Course.find({
            _id: { $in: [...new Set(ids)] },
        })
            .select('name shortName level specialization')
            .lean();
    }
};

export const submitUpdate = async (user, proposedChanges) => {
    if (!user.college) {
        throw new AppError('You are not assigned to any college.', 400);
    }

    const { error, value } = validateProposedChanges(proposedChanges);
    if (error) {
        throw new AppError(`Invalid update data: ${error}`, 400);
    }

    const collegeId =
        typeof user.college === 'object' ? user.college._id : user.college;

    if (value.slug) {
        value.slug = slugify(value.slug);
        if (!value.slug) {
            throw new AppError('Slug cannot be empty.', 400);
        }
    }

    // Fail now rather than weeks later at approval. The college's own record
    // is excluded — the form resends unchanged values, and those aren't clashes.
    await assertUniqueFields(value, collegeId);

    // One read serves both the FAQ cap check and the snapshot.
    const current = await College.findById(collegeId)
        .select(COLLEGE_REVIEW_FIELDS)
        .lean();
    if (!current) throw new AppError('College not found.', 404);

    if (value.faqs) {
        const { added = [], removed = [] } = value.faqs;

        // Only count removals that match a real FAQ, or a bogus id
        // inflates the allowance.
        const existingIds = new Set(
            (current.faqs || []).map(f => String(f._id))
        );
        const realRemovals = removed.filter(id => existingIds.has(String(id)));

        const projected =
            (current.faqs || []).length - realRemovals.length + added.length;

        if (projected > MAX_FAQS) {
            throw new AppError(
                `This would leave ${projected} FAQs. The maximum is ${MAX_FAQS}.`,
                400
            );
        }
    }

    const updateRequest = new CollegeUpdate({
        college: collegeId,
        requestedBy: user._id,
        proposedChanges: value,
        previousValues: buildSnapshot(current, value),
        status: 'pending',
    });

    try {
        await updateRequest.save();
    } catch (error) {
        throw new AppError(`Failed to submit update: ${error.message}`, 400);
    }
    return updateRequest;
};

export const getMyUpdates = async (userId, skip = 0, limit = 0) => {
    const query = CollegeUpdate.find({ requestedBy: userId });

    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .populate('college', COLLEGE_REVIEW_FIELDS)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        CollegeUpdate.countDocuments({ requestedBy: userId }),
    ]);

    // .lean() matters here: assigning populatedCourses onto a Mixed path of a
    // hydrated document would not serialise without markModified().
    await attachCourseDetails(data);

    return { data, totalCount };
};

export const getAllUpdates = async (skip = 0, limit = 0) => {
    const query = CollegeUpdate.find({ status: 'pending' });

    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .populate('college', COLLEGE_REVIEW_FIELDS)
            .populate('requestedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        CollegeUpdate.countDocuments({ status: 'pending' }),
    ]);

    await attachCourseDetails(data);

    return { data, totalCount };
};

export const approveUpdate = async updateId => {
    const updateRequest = await CollegeUpdate.findById(updateId);
    if (!updateRequest) {
        throw new AppError('Update request not found.', 404);
    }

    if (updateRequest.status !== 'pending') {
        throw new AppError(
            `Cannot approve a request that is already ${updateRequest.status}.`,
            400
        );
    }

    const college = await College.findById(updateRequest.college);
    if (!college) {
        throw new AppError('College not found.', 404);
    }

    // re-validate: catches stale requests if College schema changed since submission
    const { error, value: changes } = validateProposedChanges(
        updateRequest.proposedChanges
    );
    if (error) {
        throw new AppError(`Stored update data is invalid: ${error}`, 400);
    }

    if (changes.slug) {
        changes.slug = slugify(changes.slug);
    }

    // Another college may have taken the name/slug/collegeId in the days or
    // weeks since this was submitted.
    await assertUniqueFields(changes, college._id);

    applyProposedChanges(college, changes);

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            await college.save({ session });
            updateRequest.status = 'approved';
            await updateRequest.save({ session });
        });
    } catch (err) {
        if (err instanceof AppError) throw err;
        if (err.name === 'ValidationError') throw err;
        if (err.code === 11000) throwIfDuplicate(err);
        throw new AppError(`Failed to approve update: ${err.message}`, 500);
    } finally {
        await session.endSession();
    }

    return updateRequest;
};

export const rejectUpdate = async (updateId, adminFeedback) => {
    const updateRequest = await CollegeUpdate.findById(updateId);
    if (!updateRequest) {
        throw new AppError('Update request not found.', 404);
    }

    if (updateRequest.status !== 'pending') {
        throw new AppError(
            `Cannot reject a request that is already ${updateRequest.status}.`,
            400
        );
    }

    updateRequest.status = 'rejected';
    updateRequest.adminFeedback = adminFeedback || 'No feedback provided.';
    await updateRequest.save();

    return updateRequest;
};
