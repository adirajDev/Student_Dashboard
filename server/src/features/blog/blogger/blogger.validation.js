import Joi from 'joi';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const profileImageSchema = Joi.object({
    data: Joi.string().required(), // base64 payload
    mimeType: Joi.string()
        .valid('image/jpeg', 'image/png', 'image/webp', 'image/svg+xml')
        .required(),
    sizeBytes: Joi.number()
        .positive()
        .max(1 * 1024 * 1024) // 1MB cap — adjust to your actual limit
        .required(),
});

export const updateBloggerSchema = Joi.object({
    about: Joi.string().trim().max(2000).allow(''),
    achievements: Joi.array().items(Joi.string().trim().max(200)).max(20),
    specializations: Joi.array().items(Joi.string().trim().max(100)).max(10),
    profileImage: profileImageSchema.allow(null),
}).min(1);

// If you ever need to validate a raw ObjectId (e.g. :bloggerId param)
export const bloggerIdParamSchema = Joi.object({
    bloggerId: Joi.string().pattern(OBJECT_ID_PATTERN).required(),
});
