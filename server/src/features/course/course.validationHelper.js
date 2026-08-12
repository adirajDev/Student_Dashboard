import { validateCourse } from './course.validation.js';
import Course from './course.model.js';
import AppError from '../../common/errors/AppError.js';

export const validateAndCheckDuplicate = async (data, excludeId = null) => {
    const validated = validateCourse(data);

    if (
        validated.specialization === '' ||
        validated.specialization === undefined
    ) {
        validated.specialization = null;
    }

    const query = {
        shortName: validated.shortName,
        specialization: validated.specialization,
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const existingCourse = await Course.findOne(query);

    if (existingCourse) {
        throw new AppError('Course already exists', 400);
    }

    return validated;
};
