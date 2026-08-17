import express from 'express';
import {
    createPost,
    updatePost,
    submitForReview,
    unpublishPost,
    deletePost,
    getMyPosts,
    getPostById,
    getPendingReviewPosts,
    approvePost,
    rejectPost,
    getPublishedPosts,
    getPostBySlug,
} from './post.controller.js';
import { requireAuth } from '../../../common/middleware/auth.middleware.js';
import { requireRole } from '../../../common/middleware/role.middleware.js';
import {
    createPostSchema,
    updatePostSchema,
    rejectSchema,
    paginationQuerySchema,
    validateBody,
    validateQuery,
} from './post.validation.js';

const router = express.Router();

router.get('/', validateQuery(paginationQuerySchema), getPublishedPosts);
router.get('/slug/:slug', getPostBySlug);

router.get('/mine', requireAuth, requireRole('blogger'), getMyPosts);
router.post(
    '/',
    requireAuth,
    requireRole('blogger'),
    validateBody(createPostSchema),
    createPost
);
router.put(
    '/:id',
    requireAuth,
    requireRole('blogger'),
    validateBody(updatePostSchema),
    updatePost
);
router.patch(
    '/:id/submit',
    requireAuth,
    requireRole('blogger'),
    submitForReview
);
router.patch(
    '/:id/unpublish',
    requireAuth,
    requireRole('blogger'),
    unpublishPost
);
router.delete('/:id', requireAuth, requireRole('blogger'), deletePost);

router.get(
    '/admin/pending',
    requireAuth,
    requireRole('admin'),
    validateQuery(paginationQuerySchema),
    getPendingReviewPosts
);
router.patch('/:id/approve', requireAuth, requireRole('admin'), approvePost);
router.patch(
    '/:id/reject',
    requireAuth,
    requireRole('admin'),
    validateBody(rejectSchema),
    rejectPost
);

router.get('/:id', requireAuth, requireRole('blogger', 'admin'), getPostById);

export default router;
