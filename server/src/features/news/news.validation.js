import Joi from 'joi';
import { faqsArray } from '../../common/faq_feat/faq.validation.js';

const coverImageSchema = Joi.object({
    data: Joi.string().required(),
    mimeType: Joi.string()
        .valid(
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/avif'
        )
        .required(),
    sizeBytes: Joi.number().required(),
});

const slugField = Joi.string().trim().lowercase().pattern(SLUG_REGEX).messages({
    'string.pattern.base':
        'Slug must be lowercase alphanumeric with hyphens only',
});

export const createNewsSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    slug: slugField.allow('').optional(),
    coverImage: coverImageSchema.allow(null).default(null),
    content: Joi.string().trim().required(),
    faqs: faqsArray.default([]),
});

export const updateNewsSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    slug: slugField,
    coverImage: coverImageSchema.allow(null),
    content: Joi.string().trim().required(),
    faqs: faqsArray,
}).min(1);
