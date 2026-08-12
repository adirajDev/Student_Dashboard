import mongoose from 'mongoose';

const bloggerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        about: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        achievements: {
            type: [String],
            default: [],
            validate: [arr => arr.length <= 20, 'Max 20 achievements'],
        },
        specializations: {
            type: [String],
            default: [],
            validate: [arr => arr.length <= 10, 'Max 10 specializations'],
        },
        profileImage: {
            data: { type: String },
            mimeType: {
                type: String,
                enum: ['image/jpeg', 'image/png', 'image/webp'],
            },
            sizeBytes: { type: Number },
        },
        postCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

const Blogger = mongoose.model('Blogger', bloggerSchema);
export default Blogger;
