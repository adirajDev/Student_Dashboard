import CollegeUpdate from './collegeUpdate.model.js';
import College from '../college/college.model.js';
import Course from '../course/course.model.js';
import AppError from '../../common/errors/AppError.js';
import { validateProposedChanges } from './collegeUpdate.validation.js';
import { applyProposedChanges } from './collegeUpdate.merge.js';

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

    const updateRequest = new CollegeUpdate({
        college: collegeId,
        requestedBy: user._id,
        proposedChanges: value,
        status: 'pending',
    });

    try {
        await updateRequest.save();
    } catch (error) {
        throw new AppError(`Failed to submit update: ${err.message}`, 400);
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
            .populate('college', 'name')
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

    try {
        await college.save();
    } catch (err) {
        throw new AppError(`Failed to approve update: ${err.message}`, 400);
    }

    // Mark request as approved
    updateRequest.status = 'approved';
    await updateRequest.save();

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
