import mongoose from 'mongoose';

export const IMAGE_SIZE_LIMIT_BYTES = 500 * 1024; // 500KB

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200,
        unique: true,
    },
    coverImage: {
        data: {type: String},
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
        sizeBytes: {type: Number},
    },
    content: {
        type: String,
        required: true,
    },
    }, { timestamps: true }
);

const News = mongoose.model('News', newsSchema);
export default News;
