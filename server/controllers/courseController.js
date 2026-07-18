import Course from '../models/Course.js';
import College from '../models/College.js';

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const { name, level } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Course name is required' });
        }

        const existingCourse = await Course.findOne({ name });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course already exists' });
        }

        const course = new Course({ name, level });
        await course.save();

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
};

// Update an existing course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (name) {
            const existingCourse = await Course.findOne({ name, _id: { $ne: id } });
            if (existingCourse) {
                return res.status(400).json({ message: 'Course name already in use' });
            }
            course.name = name;
        }

        if (level) {
            course.level = level;
        }

        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course', error: error.message });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Delete the course
        await Course.findByIdAndDelete(id);

        // Remove this course from all colleges that have it in their availableCourses
        await College.updateMany(
            { availableCourses: id },
            { $pull: { availableCourses: id } }
        );

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course', error: error.message });
    }
};
