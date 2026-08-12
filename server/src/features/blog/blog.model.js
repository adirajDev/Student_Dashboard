import mongoose from 'mongoose';

// Reusable image sub-schema — used wherever an image appears in Tiptap JSON attrs
export const IMAGE_SIZE_LIMIT_BYTES = 200 * 1024; // 200KB
export const MAX_IMAGES_PER_BLOG = 10;

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [
                /^[a-z0-9-]+$/,
                'Slug must be lowercase alphanumeric with hyphens only',
            ],
        },
        excerpt: {
            // short summary for listing pages — NOT derived from content on every read
            type: String,
            maxlength: 300,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        coverImage: {
            data: { type: String }, // base64 string
            mimeType: {
                type: String,
                enum: ['image/jpeg', 'image/png', 'image/webp'],
            },
            sizeBytes: { type: Number },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
            index: true,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        imageCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ title: 'text', excerpt: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
