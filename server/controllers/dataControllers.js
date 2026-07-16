import College from '../models/College.js';
import Course from '../models/Course.js';

export const getColleges = async (req, res) => {
    try {
        const colleges = await College.find({}).sort({ name: 1 });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id).populate('availableCourses');
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ name: 1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const globalSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === '') {
            return res.json([]);
        }

        const regex = new RegExp(query.trim(), 'i');

        // Find courses that match the query
        const matchedCourses = await Course.find({ name: { $regex: regex } });
        const courseIds = matchedCourses.map(c => c._id);

        // Find colleges that match the query OR offer matched courses
        const colleges = await College.find({
            $or: [
                { name: { $regex: regex } },
                { availableCourses: { $in: courseIds } }
            ]
        }).populate('availableCourses').sort({ name: 1 });

        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
