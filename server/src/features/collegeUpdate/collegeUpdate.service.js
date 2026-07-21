import CollegeUpdate from './collegeUpdate.model.js';
import College from '../college/college.model.js';
import AppError from '../../common/utils/AppError.js';

export const submitUpdate = async (user, proposedChanges) => {
    if (!user.college) {
        throw new AppError('You are not assigned to any college.', 400);
    }

    const collegeId = typeof user.college === 'object' ? user.college._id : user.college;

    const updateRequest = new CollegeUpdate({
        college: collegeId,
        requestedBy: user._id,
        proposedChanges,
        status: 'pending'
    });

    await updateRequest.save();
    return updateRequest;
};

export const getMyUpdates = async (userId) => {
    return await CollegeUpdate.find({ requestedBy: userId }).sort({ createdAt: -1 });
};

export const getAllUpdates = async () => {
    return await CollegeUpdate.find({ status: 'pending' })
        .populate('college', 'name')
        .populate('requestedBy', 'name email')
        .sort({ createdAt: -1 });
};

export const approveUpdate = async (updateId) => {
    const updateRequest = await CollegeUpdate.findById(updateId);
    if (!updateRequest) {
        throw new AppError('Update request not found.', 404);
    }

    if (updateRequest.status !== 'pending') {
        throw new AppError(`Cannot approve a request that is already ${updateRequest.status}.`, 400);
    }

    const college = await College.findById(updateRequest.college);
    if (!college) {
        throw new AppError('College not found.', 404);
    }

    // Merge proposed changes into the college document
    const changes = updateRequest.proposedChanges;
    
    if (changes.name) college.name = changes.name;
    if (changes.overview !== undefined) college.overview = changes.overview;
    if (changes.description !== undefined) college.description = changes.description;
    
    if (changes.placementDetails) {
        college.placementDetails = {
            ...college.placementDetails,
            ...changes.placementDetails
        };
    }
    
    if (changes.recruiters) college.recruiters = changes.recruiters;
    if (changes.faculty) college.faculty = changes.faculty;

    await college.save();

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
        throw new AppError(`Cannot reject a request that is already ${updateRequest.status}.`, 400);
    }

    updateRequest.status = 'rejected';
    updateRequest.adminFeedback = adminFeedback || 'No feedback provided.';
    await updateRequest.save();

    return updateRequest;
};
