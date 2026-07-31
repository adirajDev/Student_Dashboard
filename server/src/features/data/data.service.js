import College from '../college/college.model.js';
import Course from '../course/course.model.js';

export const globalSearch = async queryStr => {
    if (!queryStr || queryStr.trim() === '') {
        return [];
    }

    const regex = new RegExp(queryStr.trim(), 'i');

    // Find courses that match the query
    const matchedCourses = await Course.find({ name: { $regex: regex } }).select('_id');
    const courseIds = matchedCourses.map(c => c._id);

    // Find colleges that match the query OR offer matched courses
    const colleges = await College.find({
        $or: [
            { name: { $regex: regex } },
            { 'availableCourses.course': { $in: courseIds } },
        ],
    })
        .select('name logo type location averageRating totalRatings availableCourses')
        .populate({
            path: 'availableCourses.course',
            select: 'name shortName',
            model: 'Course',
        })
        .sort({ name: 1 })
        .lean();

    return colleges;
};
