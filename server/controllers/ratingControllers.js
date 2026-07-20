import Rating from "../models/Rating.js";
import { recalculateCollegeRating } from "../utils/ratingCalculator.js";

export const addRating = async(req, res) => {
    try {

        const { collegeId, stars, comment } = req.body;
        const studentId = req.user._id;

        // check if user already rated 3 colleges
        const ratingCount = await Rating.countDocuments({student: studentId})
        if (ratingCount >= 3) {
            return res.status(403).json({error: 'You can rate only 3 colleges in total!'});
        }

        const rating = await Rating.create( {
            student: studentId,
            college: collegeId,
            stars,
            comment
        });

        // update college's avg and total ratings
        await recalculateCollegeRating(collegeId);

        res.status(201).json(rating);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({error: 'You have already rated this college!'});
        }
        res.status(500).json({error: error.message})
    }    
}

export const updateRating = async(req, res) => {
    try {
        const {ratingId} = req.params;
        const { stars, comment } = req.body;
        const studentId = req.user._id;

        const rating = await Rating.findOne({_id: ratingId, student: studentId});

        if (!rating) {
            return res.status(404).json({error: "Rating not found or unauthorized"})
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

        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getMyRatings = async(req, res) => {
    try {
        const studentId = req.user._id;

        const ratings = await Rating.find({student: studentId})
            .populate('college', 'name location avgRating totalRatings')
            .sort({ createdAt: -1 });

        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}