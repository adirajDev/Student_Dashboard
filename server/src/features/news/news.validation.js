import Joi from 'joi';

const coverImageSchema = Joi.object({
    data: Joi.string().required(),
    mimeType: Joi.string()
        .valid('image/jpeg', 'image/png', 'image/webp', 'image/avif')
        .required(),
    sizeBytes: Joi.number().required(),
});

export const createNewsSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    coverImage: coverImageSchema.allow(null).default(null),
    content: Joi.string().trim().required(),
});

export const updateNewsSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    coverImage: coverImageSchema.allow(null),
    content: Joi.string().trim().required(),
}).min(1);
