import CollegeUpdate from './update.model.js';
import College from '../college.model.js';
import Course from '../../course/course.model.js';
import AppError from '../../../common/errors/AppError.js';
import { validateProposedChanges } from './update.validation.js';
import { applyProposedChanges } from './update.merge.js';
import mongoose from 'mongoose';
import {MAX_FAQS_PER_COLLEGE} from "../../../common/faq_feat/faq.constants.js";

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

    if (value.faqUpdates) {
        const current = await College.findById(collegeId).select('faqs');
        if (!current) throw new AppError('College not found.', 404);

        const { added = [], removed = [] } = value.faqUpdates;

        // Only count removals that match a real FAQ, or a bogus id
        // inflates the allowance.
        const existingIds = new Set(current.faqs.map(f => f._id.toString()));
        const realRemovals = removed.filter(id => existingIds.has(String(id)));

        const projected = current.faqs.length - realRemovals.length + added.length;

        if (projected > MAX_FAQS_PER_COLLEGE) {
            throw new AppError(
                `This would leave ${projected} FAQs. The maximum is ${MAX_FAQS_PER_COLLEGE}.`,
                400
            );
        }
    }

    const updateRequest = new CollegeUpdate({
        college: collegeId,
        requestedBy: user._id,
        proposedChanges: value,
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
        query.clone().sort({ createdAt: -1 }).skip(skip).limit(limit),
        CollegeUpdate.countDocuments({ requestedBy: userId }),
    ]);
    return { data, totalCount };
};

export const getAllUpdates = async (skip = 0, limit = 0) => {
    const query = CollegeUpdate.find({ status: 'pending' });
    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .populate('college', 'name faqs')
            .populate('requestedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        CollegeUpdate.countDocuments({ status: 'pending' }),
    ]);

    // Manually populate courses for courseUpdates delta
    for (const update of data) {
        if (update.proposedChanges?.courseUpdates) {
            const courseIds = [];
            const cu = update.proposedChanges.courseUpdates;
            if (cu.added) courseIds.push(...cu.added.map(a => a.course));
            if (cu.updated) courseIds.push(...cu.updated.map(u => u.course));
            if (cu.removed) courseIds.push(...cu.removed);

            if (courseIds.length > 0) {
                const uniqueIds = [...new Set(courseIds)];
                const courses = await Course.find({
                    _id: { $in: uniqueIds },
                }).select('name shortName level specialization');
                cu.populatedCourses = courses;
            }
        }
    }

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
        if (err.name === 'ValidationError' || err.code === 11000) throw err;
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
