import mongoose from 'mongoose';
import { MAX_FAQS } from './faq.constants.js';

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
            maxLength: [
                300,
                "Maximum length of question can't exceed 300 chars.",
            ],
        },
        answer: {
            type: String,
            required: true,
            trim: true,
            maxLength: [
                5000,
                "Maximum length of answer can't exceed 5000 chars.",
            ],
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { _id: true, timestamps: true }
);

export const faqsField = {
    type: [faqSchema],
    default: [],
    validate: {
        validator: v => v.length <= MAX_FAQS,
        message: "Can't have more than 10 faqs",
    },
};
