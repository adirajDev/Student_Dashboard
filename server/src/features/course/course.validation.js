import Joi from 'joi';
import AppError from '../../common/utils/AppError.js';
import { COURSE_LEVELS, COURSE_LIMITS } from './course.constants.js';

const courseSchema = Joi.object({
    level: Joi.string()
        .valid(...COURSE_LEVELS)
        .required(),

    shortName: Joi.string().trim().max(COURSE_LIMITS.SHORT_NAME_MAX).required(),

    name: Joi.string().trim().max(COURSE_LIMITS.NAME_MAX).required(),

    specialization: Joi.string()
        .trim()
        .allow(null, '')
        .max(COURSE_LIMITS.SPECIALIZATION_MAX),

    duration: Joi.number().integer().min(1).required(),
});

export const validateCourse = data => {
    const { error, value } = courseSchema.validate(data, {
        abortEarly: true,
    });

    if (error) {
        let message = error.details[0].message.replace(/"/g, '');
        message = message.charAt(0).toUpperCase() + message.slice(1);
        throw new AppError(message, 400);
    }

    return value;
};
