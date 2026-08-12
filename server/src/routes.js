import { Router } from 'express';
import authRoutes from './features/auth/auth.routes.js';
import accountRoutes from './features/user/account/account.routes.js';
import { createUserRouter } from './features/user/admin/userAdmin.routes.js';
import applicationRoutes from "./features/application/application.routes.js";
import ratingRoutes from './features/rating/rating.routes.js';
import statsRoutes from './features/stats/stats.routes.js';
import collegeUpdateRoutes from './features/college/update/update.routes.js';
import examRoutes from './features/exam/exam.routes.js';
import collegeRoutes from './features/college/college.routes.js';
import collegeGalleryRoutes from './features/college/gallery/gallery.routes.js';
import courseRoutes from './features/course/course.routes.js';

const ADMIN_ONLY = {
    list: ['admin'],
    create: ['admin'],
    update: ['admin'],
    remove: ['admin'],
};
const ADMIN_EDITOR_MANAGED = {
    list: ['admin', 'editor'],
    create: ['admin'],
    update: ['admin', 'editor'],
    remove: ['admin'],
};

const router = Router();

// Profile and authentication routes
router.use('/', authRoutes);
router.use('/', accountRoutes);

// User CRUD routes for roles
router.use(
    '/students',
    createUserRouter({ role: 'student', permissions: ADMIN_EDITOR_MANAGED })
);
router.use(
    '/editors',
    createUserRouter({ role: 'editor', permissions: ADMIN_ONLY })
);
router.use(
    '/bloggers',
    createUserRouter({ role: 'blogger', permissions: ADMIN_ONLY })
);
router.use(
    '/college-users',
    createUserRouter({ role: 'college', permissions: ADMIN_ONLY })
);

// College routes
router.use('/colleges', collegeRoutes);
router.use('/college-gallery', collegeGalleryRoutes);
router.use('/college-updates', collegeUpdateRoutes);

// Other routes
router.use('/courses', courseRoutes);
router.use('/applications', applicationRoutes);
router.use('/ratings', ratingRoutes);
router.use('/exams', examRoutes);
router.use('/stats', statsRoutes);

export default router;
