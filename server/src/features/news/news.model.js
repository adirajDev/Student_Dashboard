import mongoose from 'mongoose';
import { faqsField } from '../../common/faq_feat/faq.schema.js';
import { SLUG_REGEX } from '../../common/utils/slug.util.js';

export const IMAGE_SIZE_LIMIT_BYTES = 500 * 1024; // 500KB

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 200,
            unique: true,
        },
        coverImage: {
            data: { type: String },
            mimeType: {
                type: String,
                enum: [
                    'image/jpg',
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                    'image/avif',
                    'image/gif',
                ],
            },
            sizeBytes: { type: Number },
        },
        content: {
            type: String,
            required: true,
        },
        faqs: faqsField,
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [
                SLUG_REGEX,
                'Slug must be lowercase alphanumeric with hyphens only',
            ],
        },
    },
    { timestamps: true }
);

const News = mongoose.model('News', newsSchema);
export default News;
