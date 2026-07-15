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

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ name: 1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
