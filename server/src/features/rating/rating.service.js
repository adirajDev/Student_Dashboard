import Rating from './rating.model.js';
import { recalculateCollegeRating } from './rating.util.js';
import AppError from '../../common/errors/AppError.js';

export const addRating = async (user, data) => {
    const { collegeId, stars, comment } = data;

    // Check if the user is currently in the college they are trying to rate
    const userCollegeId =
        user.college?._id?.toString() || user.college?.toString();
    if (userCollegeId !== collegeId) {
        throw new AppError(
            'You can only rate the college you are currently enrolled in.',
            403
        );
    }

    try {
        const rating = await Rating.create({
            student: user._id,
            college: collegeId,
            stars,
            comment,
        });

        // update college's avg and total ratings
        await recalculateCollegeRating(collegeId);
        return rating;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('You have already rated this college!', 400);
        }
        throw error;
    }
};

export const getRatingsByCollege = async (
    collegeId,
    skip = 0,
    limit = 0,
    stars = 0
) => {
    const queryObj = { college: collegeId };
    if (stars > 0) {
        queryObj.stars = stars;
    }
    const query = Rating.find(queryObj);
    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .select(
                'student college stars comment isEdited createdAt updatedAt'
            )
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Rating.countDocuments(queryObj),
    ]);
    return { data, totalCount };
};

export const getMyRatings = async (studentId, skip = 0, limit = 0) => {
    const query = Rating.find({ student: studentId });
    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .select(
                'student college stars comment isEdited createdAt updatedAt'
            )
            .populate('college', 'name location logo')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Rating.countDocuments({ student: studentId }),
    ]);
    return { data, totalCount };
};

export const updateRating = async (studentId, ratingId, data) => {
    const { stars, comment } = data;

    const rating = await Rating.findOne({ _id: ratingId, student: studentId });

    if (!rating) {
        throw new AppError('Rating not found or unauthorized', 404);
    }

    const starsChanged = stars !== undefined && rating.stars !== stars;

    if (stars !== undefined) rating.stars = stars;
    if (comment !== undefined) rating.comment = comment;

    if (rating.isModified()) {
        rating.isEdited = true;
        await rating.save();
    }

    if (starsChanged) {
        await recalculateCollegeRating(rating.college);
    }

    return rating;
};

export const deleteRating = async (studentId, ratingId) => {
    const rating = await Rating.findOneAndDelete({
        _id: ratingId,
        student: studentId,
    });

    if (!rating) {
        throw new AppError('Rating not found or unauthorized', 404);
    }

    await recalculateCollegeRating(rating.college);
};
