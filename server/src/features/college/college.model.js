import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        location: {
            type: String,
            trim: true,
            default: 'Unknown',
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
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],
        placementDetails: {
            averagePackage: { type: String, trim: true },
            highestPackage: { type: String, trim: true },
            placementPercentage: { type: Number, min: 0, max: 100 },
        },
        recruiters: [
            {
                type: String,
                trim: true,
            },
        ],
        faculty: [
            {
                name: { type: String, required: true, trim: true },
                department: { type: String, trim: true },
                role: { type: String, trim: true },
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
    },
    { timestamps: true }
);

const College = mongoose.model('College', collegeSchema);
export default College;
