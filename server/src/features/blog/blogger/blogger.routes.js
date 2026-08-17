import express from 'express';
import { requireAuth } from '../../../common/middleware/auth.middleware.js';
import { requireRole } from '../../../common/middleware/role.middleware.js';
import {
    getBloggerByUserId,
    updateBloggerByUserId,
} from './blogger.controller.js';

const routes = express.Router();
routes.get('/:userId', getBloggerByUserId);
routes.patch(
    '/profile',
    requireAuth,
    requireRole('blogger'),
    updateBloggerByUserId
);

export default routes;
