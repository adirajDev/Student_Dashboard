import Course from './course.model.js';
import College from '../college/college.model.js';
import AppError from '../../common/utils/AppError.js';

export const getCourses = async (skip = 0, limit = 0, search = '') => {
    const queryObj = {};
    if (search) {
        queryObj.$or = [
            { name: { $regex: search, $options: 'i' } },
            { level: { $regex: search, $options: 'i' } }
        ];
    }
    const query = Course.find(queryObj);
    const [data, totalCount] = await Promise.all([
        query.clone()
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),
        Course.countDocuments(queryObj)
    ]);
    return { data, totalCount };
};

export const createCourse = async data => {
    const { name, level } = data;

    if (!name) {
        throw new AppError('Course name is required', 400);
    }

    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
        throw new AppError('Course already exists', 400);
    }

    const course = new Course({ name, level });
    await course.save();

    return course;
};

export const updateCourse = async (id, data) => {
    const { name, level } = data;

    const course = await Course.findById(id);
    if (!course) {
        throw new AppError('Course not found', 404);
    }

    if (name) {
        const existingCourse = await Course.findOne({ name, _id: { $ne: id } });
        if (existingCourse) {
            throw new AppError('Course name already in use', 400);
        }
        course.name = name;
    }

    if (level) {
        course.level = level;
    }

    await course.save();
    return course;
};

export const deleteCourse = async id => {
    const course = await Course.findById(id);
    if (!course) {
        throw new AppError('Course not found', 404);
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    // Remove this course from all colleges that have it in their availableCourses
    await College.updateMany(
        { availableCourses: id },
        { $pull: { availableCourses: id } }
    );

    return course;
};
