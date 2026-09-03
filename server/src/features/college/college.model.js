import mongoose from 'mongoose';
import { COLLEGE_TYPE, STATES } from './college.constants.js';
import { faqsField } from '../../common/faq_feat/faq.schema.js';

const collegeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        logo: {
            type: String,
            trim: true,
        },
        images: [
            {
                data: Buffer,
                contentType: String,
            },
        ],
        videos: [
            {
                url: {
                    type: String,
                    trim: true,
                },
            },
        ],
        type: {
            type: String,
            enum: COLLEGE_TYPE,
            required: true,
            default: 'Private',
        },
        state: {
            type: String,
            trim: true,
            enum: STATES,
            default: 'Delhi NCR',
            required: true,
        },
        city: {
            type: String,
            trim: true,
            default: 'New Delhi',
            required: true,
        },
        collegeId: {
            type: String,
            trim: true,
            sparse: true, // sparse unique index allows null/missing
            unique: true,
        },
        description: {
            type: String,
            trim: true,
        },
        overview: {
            type: String,
            trim: true,
        },
        availableCourses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                },
                fee: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        placementDetails: {
            averagePackage: {
                type: String,
                trim: true,
            },
            highestPackage: {
                type: String,
                trim: true,
            },
            placementPercentage: {
                type: Number,
                min: 0,
                max: 100,
            },
        },
        recruiters: [
            {
                type: String,
                trim: true,
            },
        ],
        faculty: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                department: {
                    type: String,
                    trim: true,
                },
                role: {
                    type: String,
                    trim: true,
                },
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        faqs: faqsField,
    },
    { timestamps: true }
);

// Prevent massive image buffers from being serialized in JSON responses
collegeSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.images && Array.isArray(ret.images)) {
            ret.images = ret.images.map(img => {
                const { data, ...rest } = img;
                return rest;
            });
        }
        return ret;
    },
});

collegeSchema.set('toObject', {
    transform: (doc, ret) => {
        if (ret.images && Array.isArray(ret.images)) {
            ret.images = ret.images.map(img => {
                const { data, ...rest } = img;
                return rest;
            });
        }
        return ret;
    },
});

const College = mongoose.model('College', collegeSchema);
export default College;
