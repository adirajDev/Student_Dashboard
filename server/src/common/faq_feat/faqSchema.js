import mongoose from 'mongoose';

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

export default faqSchema;
