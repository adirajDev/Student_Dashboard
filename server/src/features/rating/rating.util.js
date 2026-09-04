import mongoose from 'mongoose';
import College from '../college/college.model.js';
import Rating from './rating.model.js';

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

export const hasApplicationTo = (user, collegeId) =>
    (user.applications || []).some(
        app => (app.college?._id || app.college)?.toString() === collegeId
    );
