import Joi from 'joi';
import AppError from '../errors/AppError.js';

export const passwordSchema = Joi.string()
    .min(6)
    .pattern(/[A-Z]/, 'one uppercase letter')
    .pattern(/[0-9]/, 'one number')
    .pattern(/[^A-Za-z0-9]/, 'one special character')
    .required()
    .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.name': 'Password must contain at least {#name}',
        'any.required': 'Password is required',
        'string.empty': 'Password is required',
    });

export const assertValidPassword = password => {
    const { error } = passwordSchema.validate(password);
    if (error) throw new AppError(error.details[0].message, 400);
};
