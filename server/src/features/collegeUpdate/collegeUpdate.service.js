import CollegeUpdate from './collegeUpdate.model.js';
import College from '../college/college.model.js';
import AppError from '../../common/utils/AppError.js';

export const submitUpdate = async (user, proposedChanges) => {
    if (!user.college) {
        throw new AppError('You are not assigned to any college.', 400);
    }

    const collegeId =
        typeof user.college === 'object' ? user.college._id : user.college;

    const updateRequest = new CollegeUpdate({
        college: collegeId,
        requestedBy: user._id,
        proposedChanges,
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
            .limit(limit),
        CollegeUpdate.countDocuments({ status: 'pending' }),
    ]);
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


    // Merge proposed changes into the college document
    const changes = updateRequest.proposedChanges;

    if (changes.name) college.name = changes.name;
    if (changes.overview === '') college.overview = null;
    if (changes.overview !== undefined) college.overview = changes.overview;
    if (changes.description !== undefined)
        college.description = changes.description;
    if (changes.logo !== undefined) college.logo = changes.logo;
    if (changes.type) college.type = changes.type;
    if (changes.location !== undefined) college.location = changes.location;
    if (changes.collegeId !== undefined) college.collegeId = changes.collegeId;
    if (changes.availableCourses !== undefined)
        college.availableCourses = changes.availableCourses;

    if (changes.placementDetails) {
        if (!college.placementDetails) college.placementDetails = {};
        if (changes.placementDetails.averagePackage !== undefined)
            college.placementDetails.averagePackage = changes.placementDetails.averagePackage;
        if (changes.placementDetails.highestPackage !== undefined)
            college.placementDetails.highestPackage = changes.placementDetails.highestPackage;
        if (changes.placementDetails.placementPercentage !== undefined) {
            college.placementDetails.placementPercentage = 
                changes.placementDetails.placementPercentage === '' 
                    ? null 
                    : changes.placementDetails.placementPercentage;
        }
    }

    if (changes.recruiters) college.recruiters = changes.recruiters;
    if (changes.faculty) college.faculty = changes.faculty;

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
