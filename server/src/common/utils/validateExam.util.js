import Joi from 'joi';
import AppError from './AppError.js';

const examSchema = Joi.object({
    name: Joi.string().required(),
    requirement: Joi.string().required(),
    regStartingDate: Joi.date().required(),
    regEndingDate: Joi.date().required(),
    examMode: Joi.string().required(),
    examDescription: Joi.string().required(),
    examLink: Joi.string().uri().optional().allow('')
});

export const validateExam = (data) => {
    const { error, value } = examSchema.validate(data, { abortEarly: true });
    
    if (error) {
        let message = error.details[0].message.replace(/"/g, '');
        message = message.charAt(0).toUpperCase() + message.slice(1);
        throw new AppError(message, 400);
    }
    
    return value;
};