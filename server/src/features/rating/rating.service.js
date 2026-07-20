import Rating from "./rating.model.js";
import { recalculateCollegeRating } from "../../../utils/ratingCalculator.js";
import AppError from '../../common/utils/AppError.js';

export const addRating = async (studentId, data) => {
    const { collegeId, stars, comment } = data;

    // check if user already rated 3 colleges
    const ratingCount = await Rating.countDocuments({ student: studentId });
    if (ratingCount >= 3) {
        throw new AppError('You can rate only 3 colleges in total!', 403);
    }

    try {
        const rating = await Rating.create({
            student: studentId,
            college: collegeId,
            stars,
            comment
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

export const updateRating = async (studentId, ratingId, data) => {
    const { stars, comment } = data;

    const rating = await Rating.findOne({ _id: ratingId, student: studentId });

    if (!rating) {
        throw new AppError("Rating not found or unauthorized", 404);
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
    const rating = await Rating.findOneAndDelete({ _id: ratingId, student: studentId });

    if (!rating) {
        throw new AppError("Rating not found or unauthorized", 404);
    }
    
    await recalculateCollegeRating(rating.college);
};
