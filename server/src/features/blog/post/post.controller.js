import * as postService from './post.service.js';
import asyncHandler from '../../../common/utils/asyncHandler.js';
import {
    getPaginationOptions,
    formatPaginatedResponse,
} from '../../../common/utils/pagination.util.js';

export const createPost = asyncHandler(async (req, res) => {
    const post = await postService.createPost(req.user._id, req.body);
    res.status(201).json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req, res) => {
    const post = await postService.updatePost(
        req.params.id,
        req.user._id,
        req.body
    );
    res.status(200).json({ success: true, data: post });
});

export const submitForReview = asyncHandler(async (req, res) => {
    const post = await postService.submitForReview(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: post });
});

export const unpublishPost = asyncHandler(async (req, res) => {
    const post = await postService.unpublishPost(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
    await postService.deletePost(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Post deleted.' });
});

export const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getMyPosts(req.user._id);
    res.status(200).json({ success: true, data: posts });
});

export const getPostById = asyncHandler(async (req, res) => {
    const post = await postService.getPostForOwnerOrAdmin(
        req.params.id,
        req.user
    );
    res.status(200).json({ success: true, data: post });
});

export const getPendingReviewPosts = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const { data, totalCount } = await postService.getPendingReviewPosts({
        skip,
        limit,
    });
    res.status(200).json({
        success: true,
        ...formatPaginatedResponse(data, totalCount, page, limit),
    });
});

export const approvePost = asyncHandler(async (req, res) => {
    const post = await postService.approvePost(req.params.id);
    res.status(200).json({ success: true, data: post });
});

export const rejectPost = asyncHandler(async (req, res) => {
    const post = await postService.rejectPost(
        req.params.id,
        req.body.reviewNote
    );
    res.status(200).json({ success: true, data: post });
});

export const getPublishedPosts = asyncHandler(async (req, res) => {
    // const { page, limit, skip } = getPaginationOptions(req);
    // const { data, totalCount } = await postService.getPublishedPosts({
    //     skip,
    //     limit,
    // });
    const data = await postService.getPublishedPosts();
    res.status(200).json({
        success: true,
        data: data,
        // ...formatPaginatedResponse(data, totalCount, page, limit),
    });
});

export const getPostBySlug = asyncHandler(async (req, res) => {
    const post = await postService.getPublishedPostBySlug(req.params.slug);
    res.status(200).json({ success: true, data: post });
});
