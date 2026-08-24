import mongoose from 'mongoose';

import Post from './post.model.js';
import AppError from '../../../common/errors/AppError.js';
import {
    validatePostContent,
    validateCoverImage,
} from './post.content-validator.js';
import Blogger from '../blogger/blogger.model.js';

const EDITABLE_STATUSES = ['draft', 'rejected'];

const ensureSlugAvailable = async (slug, excludeId = null) => {
    const query = { slug };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const existing = await Post.findOne(query);
    if (existing) {
        throw new AppError('A post with this slug already exists.', 409);
    }
};

const loadOwnedPost = async (postId, authorId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError('Post not found.', 404);
    }
    if (!post.author.equals(authorId)) {
        throw new AppError(
            'You do not have permission to modify this post.',
            403
        );
    }
    return post;
};

const updatePostCount = async (userId, delta = 1) => {
    const blogger = await Blogger.findOneAndUpdate(
        { user: userId },
        { $inc: { postCount: delta } },
        { returnDocument: 'after' }
    );

    if (!blogger) {
        // Author has no blogger profile (shouldn't normally happen per your
        // data model, but don't let a missing profile break the approval flow)
        throw new AppError(
            `No blogger profile found for user ${userId}; postCount not updated.`,
            404
        );
    }

    return blogger;
};

export const createPost = async (authorId, payload) => {
    const { imageCount } = validatePostContent(payload.content);
    validateCoverImage(payload.coverImage);

    await ensureSlugAvailable(payload.slug);

    const post = new Post({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        author: authorId,
        status: 'draft',
        imageCount,
    });

    await post.save();
    return post;
};

export const updatePost = async (postId, authorId, payload) => {
    const post = await loadOwnedPost(postId, authorId);

    if (!EDITABLE_STATUSES.includes(post.status)) {
        throw new AppError(
            'Post can only be edited while draft or rejected.',
            409
        );
    }

    const content =
        payload.content !== undefined ? payload.content : post.content;
    const { imageCount } = validatePostContent(content);
    validateCoverImage(
        payload.coverImage !== undefined ? payload.coverImage : post.coverImage
    );

    if (payload.slug && payload.slug !== post.slug) {
        await ensureSlugAvailable(payload.slug, post._id);
        post.slug = payload.slug;
    }

    if (payload.title !== undefined) post.title = payload.title;
    if (payload.excerpt !== undefined) post.excerpt = payload.excerpt;
    if (payload.content !== undefined) post.content = payload.content;
    if (payload.coverImage !== undefined) post.coverImage = payload.coverImage;
    post.imageCount = imageCount;

    if (post.status === 'rejected') {
        post.status = 'draft';
        post.reviewNote = null;
        post.reviewedAt = null;
    }

    await post.save();
    return post;
};

export const submitForReview = async (postId, authorId) => {
    const post = await loadOwnedPost(postId, authorId);

    if (!EDITABLE_STATUSES.includes(post.status)) {
        throw new AppError(
            'Post can only be submitted for review while draft or rejected.',
            409
        );
    }

    post.status = 'pending_review';
    await post.save();
    return post;
};

export const unpublishPost = async (postId, authorId) => {
    const post = await loadOwnedPost(postId, authorId);

    if (post.status !== 'published') {
        throw new AppError('Only published posts can be unpublished.', 409);
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            post.status = 'draft';
            post.publishedAt = null;
            await updatePostCount(post.author, -1);
            await post.save();
        });
    } finally {
        await session.endSession();
    }
    return post;
};

export const deletePost = async (postId, authorId) => {
    const post = await loadOwnedPost(postId, authorId);

    if (!EDITABLE_STATUSES.includes(post.status)) {
        throw new AppError(
            'Post can only be deleted while draft or rejected.',
            409
        );
    }

    await post.deleteOne();
};

export const getMyPosts = async authorId => {
    return Post.find({ author: authorId }).sort({ updatedAt: -1 }).lean();
};

export const getPostForOwnerOrAdmin = async (postId, requestingUser) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError('Post not found.', 404);
    }

    const isOwner = post.author.equals(requestingUser._id);
    const isAdmin = requestingUser.role === 'admin';
    if (!isOwner && !isAdmin) {
        throw new AppError(
            'You do not have permission to view this post.',
            403
        );
    }

    return post;
};

export const getPendingReviewPosts = async ({ skip = 0, limit = 0 }) => {
    const queryObj = { status: 'pending_review' };
    const [data, totalCount] = await Promise.all([
        Post.find(queryObj).sort({ createdAt: 1 }).skip(skip).limit(limit),
        Post.countDocuments(queryObj),
    ]);
    return { data, totalCount };
};

export const approvePost = async postId => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError('Post not found.', 404);
    }
    if (post.status !== 'pending_review') {
        throw new AppError('Only posts pending review can be approved.', 409);
    }

    const now = new Date();
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            post.status = 'published';
            post.publishedAt = now;
            post.reviewedAt = now;
            await post.save({ session });
            await updatePostCount(post.author, 1);
        });
    } finally {
        await session.endSession();
    }

    return post;
};

export const rejectPost = async (postId, reviewNote) => {
    if (!reviewNote || !reviewNote.trim()) {
        throw new AppError('A review note is required to reject a post.', 400);
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError('Post not found.', 404);
    }
    if (post.status !== 'pending_review') {
        throw new AppError('Only posts pending review can be rejected.', 409);
    }

    post.status = 'rejected';
    post.reviewNote = reviewNote;
    post.reviewedAt = new Date();
    await post.save();
    return post;
};

// TODO: re-add pagination (see git history)
export const getPublishedPosts = async () => {
    const queryObj = { status: 'published' };

    const posts = await Post.find(queryObj)
        .select('title slug excerpt')
        .populate({
            path: 'author',
            select: 'name',
            populate: {
                path: 'bloggerProfile',
                select: 'profileImage postCount -user',
            },
        })
        .sort({ publishedAt: -1 })
        .lean();

    return posts;
};

export const getPublishedPostBySlug = async slug => {
    const post = await Post.findOne({ slug, status: 'published' })
        .populate({
            path: 'author',
            select: 'name email phone',
            populate: {
                path: 'bloggerProfile',
                select: 'profileImage postCount -user',
            },
        })
        .lean();

    if (!post) {
        throw new AppError('Post not found.', 404);
    }
    return post;
};
