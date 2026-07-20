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
