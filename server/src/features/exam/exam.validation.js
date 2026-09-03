import Joi from 'joi';
import AppError from '../../common/errors/AppError.js';
import { faqsArray } from '../../common/faq_feat/faq.validation.js';

const examSchema = Joi.object({
    name: Joi.string().required(),
    requirement: Joi.string().required(),
    regStartingDate: Joi.date().required(),
    regEndingDate: Joi.date().required(),
    examMode: Joi.string().required(),
    examDescription: Joi.string().required(),
    examLink: Joi.string().uri().optional().allow(''),
    examDate: Joi.date().min(Joi.ref('regEndingDate')).required(),
    examDuration: Joi.number().min(1).required(),
    examTime: Joi.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
    faqs: faqsArray,
});

export const updateExamSchema = Joi.object({
    name: Joi.string(),
    requirement: Joi.string(),
    regStartingDate: Joi.date(),
    regEndingDate: Joi.date(),
    examMode: Joi.string(),
    examDescription: Joi.string(),
    examLink: Joi.string().uri().allow(''),
    examDate: Joi.date(),
    examDuration: Joi.number().min(1),
    examTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    faqs: faqsArray,
}).min(1);

export const validateExam = data => {
    const { error, value } = examSchema.validate(data, { abortEarly: true });

    if (error) {
        let message = error.details[0].message.replace(/"/g, '');
        message = message.charAt(0).toUpperCase() + message.slice(1);
        throw new AppError(message, 400);
    }

    return value;
};

export const validateExamUpdate = data => {
    const { error, value } = updateExamSchema.validate(data, {
        abortEarly: true,
        stripUnknown: true,
    });
    if (error) {
        let message = error.details[0].message.replace(/"/g, '');
        message = message.charAt(0).toUpperCase() + message.slice(1);
        throw new AppError(message, 400);
    }
    return value;
};
