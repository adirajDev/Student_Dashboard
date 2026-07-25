import mongoose from 'mongoose';
import { COURSE_LEVELS } from './course.constants.js';

const courseSchema = new mongoose.Schema(
    {
        level: {
            type: String,
            enum: COURSE_LEVELS,
            required: true,
            default: "Bachelor's",
            index: true,
        },

        shortName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        specialization: {
            type: String,
            trim: true,
            default: null,
        },

        // Duration in months for consistency.
        // Examples:
        // 6  = 6 months
        // 24 = 2 years
        // 48 = 4 years
        // 66 = 5.5 years (MBBS)
        duration: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate programs
courseSchema.index(
    {
        shortName: 1,
        specialization: 1,
    },
    {
        unique: true,
    }
);

// Full-text search
courseSchema.index({
    shortName: 'text',
    name: 'text',
    specialization: 'text',
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
