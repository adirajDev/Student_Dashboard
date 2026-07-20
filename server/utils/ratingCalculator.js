import College from "../src/features/college/college.model.js";
import Rating from "../src/features/rating/rating.model.js";

export const recalculateCollegeRating = async (collegeId) => {
    const stats = await Rating.aggregate([
        {$match: {college: collegeId}},
        {
            $group: {
                _id: '$college',
                average: {$avg: '$stars'},
                count: {$sum: 1}
            }
        }
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0;
    const totalRatings = stats.length > 0 ? stats[0].count : 0;

    await College.findByIdAndUpdate(collegeId, {
        averageRating, 
        totalRatings
    });
}