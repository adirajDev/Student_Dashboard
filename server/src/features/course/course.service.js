import Course from './course.model.js';
import College from '../college/college.model.js';
import AppError from '../../common/utils/AppError.js';
import { validateAndCheckDuplicate } from './course.validationHelper.js';

export const getCourses = async (skip = 0, limit = 0, search = '') => {
    const queryObj = {};
    if (search) {
        queryObj.$or = [
            { name: { $regex: search, $options: 'i' } },
            { level: { $regex: search, $options: 'i' } },
        ];
    }
    const query = Course.find(queryObj);
    const [data, totalCount] = await Promise.all([
        query.clone().sort({ name: 1 }).skip(skip).limit(limit),
        Course.countDocuments(queryObj),
    ]);
    return { data, totalCount };
};

export const createCourse = async data => {
    const validated = await validateAndCheckDuplicate(data);

    const course = new Course({
        level: validated.level,
        shortName: validated.shortName,
        name: validated.name,
        specialization: validated.specialization,
        duration: validated.duration,
    });

    await course.save();

    return course;
};

export const updateCourse = async (id, data) => {
    const course = await Course.findById(id);
    if (!course) {
        throw new AppError('Course not found', 404);
    }

    const validated = await validateAndCheckDuplicate(data, id);

    course.level = validated.level;
    course.shortName = validated.shortName;
    course.name = validated.name;
    course.specialization = validated.specialization;
    course.duration = validated.duration;

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
