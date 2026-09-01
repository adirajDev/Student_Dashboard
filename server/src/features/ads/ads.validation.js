import Joi from 'joi';
import { AD_SLOT_IDS, AD_STATUSES } from './ads.constants.js';

const imageSchema = Joi.object({
    data: Joi.string().required(),
    mimeType: Joi.string()
        .valid(
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/avif',
            'image/gif'
        )
        .required(),
    sizeBytes: Joi.number().required(),
});

/**
 * The scheme restriction is the important part. Without it an admin can save
 * `javascript:alert(1)` as a targetUrl and the ad link becomes a stored XSS
 * vector, because the value goes straight into an href.
 */
const targetUrl = Joi.string()
    .trim()
    .uri({ scheme: ['http', 'https'] })
    .max(2000)
    .messages({
        'string.uri': 'targetUrl must be a full http:// or https:// URL',
    });

export const createAdSchema = Joi.object({
    label: Joi.string().trim().max(120).required(),
    slot: Joi.string()
        .valid(...AD_SLOT_IDS)
        .required(),
    image: imageSchema.required(),
    targetUrl: targetUrl.required(),
    status: Joi.string()
        .valid(...AD_STATUSES)
        .default('draft'),
    priority: Joi.number().integer().min(0).max(100).default(0),
    startsAt: Joi.date().allow(null).default(null),
    // Joi.ref only resolves against a sibling that is present, so this passes
    // when startsAt is omitted or null — which is what we want.
    endsAt: Joi.date().min(Joi.ref('startsAt')).allow(null).default(null),
});

/**
 * Partial by design: the admin form sends only what changed, and `.min(1)`
 * rejects an empty body rather than silently doing nothing. `image` is
 * omitted when the admin keeps the existing one.
 */
export const updateAdSchema = Joi.object({
    label: Joi.string().trim().max(120),
    slot: Joi.string().valid(...AD_SLOT_IDS),
    image: imageSchema,
    targetUrl,
    status: Joi.string().valid(...AD_STATUSES),
    priority: Joi.number().integer().min(0).max(100),
    startsAt: Joi.date().allow(null),
    endsAt: Joi.date().min(Joi.ref('startsAt')).allow(null),
}).min(1);
