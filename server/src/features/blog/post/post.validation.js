import Joi from 'joi';
import {
    validate,
    validateBody,
} from '../../../common/validation/validation.util.js';

export { validateBody };

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const coverImageSchema = Joi.object({
    data: Joi.string().required(),
    mimeType: Joi.string()
        .valid('image/jpeg', 'image/png', 'image/webp', 'image/avif')
        .required(),
    sizeBytes: Joi.number().required(),
});

export const createPostSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    slug: Joi.string().trim().lowercase().pattern(SLUG_PATTERN).required(),
    excerpt: Joi.string().trim().max(300).allow(''),
    content: Joi.object().required(),
    coverImage: coverImageSchema.allow(null),
});

export const updatePostSchema = Joi.object({
    title: Joi.string().trim().max(200),
    slug: Joi.string().trim().lowercase().pattern(SLUG_PATTERN),
    excerpt: Joi.string().trim().max(300).allow(''),
    content: Joi.object(),
    coverImage: coverImageSchema.allow(null),
}).min(1);

export const rejectSchema = Joi.object({
    reviewNote: Joi.string().trim().min(1).max(1000).required(),
});

export const paginationQuerySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
});

export const validateQuery = schema => (req, res, next) => {
    // req.query is a read-only getter in Express 5 — mutate in place instead
    // of reassigning, since `req.query = ...` throws under the hood.
    Object.assign(req.query, validate(schema, req.query));
    next();
};
