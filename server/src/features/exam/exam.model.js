import mongoose from 'mongoose';
import { faqsField } from '../../common/faq_feat/faq.schema.js';
import { SLUG_REGEX } from '../../common/utils/slug.util.js';

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    requirement: {
        type: String,
        required: true,
        trim: true,
    },
    regStartingDate: {
        type: Date,
        required: true,
    },
    regEndingDate: {
        type: Date,
        required: true,
    },
    examMode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true,
        default: 'Offline',
    },
    examDescription: {
        type: String,
        trim: true,
    },
    examLink: {
        type: String,
        trim: true,
    },
    examDate: {
        type: Date,
        required: true,
    },
    examDuration: {
        type: Number, // In minutes
        required: true,
    },
    examTime: {
        type: String, // HH:mm format
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
});

examSchema.index({ slug: 1 }, { unique: true })

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
