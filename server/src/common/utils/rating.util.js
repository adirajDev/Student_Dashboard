import mongoose from 'mongoose';
import College from '../../features/college/college.model.js';
import Rating from '../../features/rating/rating.model.js';

export const recalculateCollegeRating = async collegeId => {
    const stats = await Rating.aggregate([
        { $match: { college: new mongoose.Types.ObjectId(collegeId) } },
        {
            $group: {
                _id: '$college',
                average: { $avg: '$stars' },
                count: { $sum: 1 },
            },
        },
    ]);

    const averageRating =
        stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0;
    const totalRatings = stats.length > 0 ? stats[0].count : 0;

    await College.findByIdAndUpdate(collegeId, {
        averageRating,
        totalRatings,
    });
};
