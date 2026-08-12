import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

const baseUser = {
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().trim().lowercase().email(),
    phone: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .messages({
            'string.pattern.base':
                'Phone must be 7-20 characters: numbers, spaces, +, -, or parentheses.',
        }),
};

export const createUserSchema = Joi.object({
    name: baseUser.name.required(),
    email: baseUser.email.required(),
    phone: baseUser.phone.required(),
});

export const createCollegeUserSchema = createUserSchema.keys({
    college: objectId.required(),
});

export const updateUserSchema = Joi.object(baseUser).min(1);

export const updateCollegeUserSchema = updateUserSchema.keys({
    college: objectId,
});
