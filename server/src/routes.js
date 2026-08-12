import { Router } from 'express';
import collegeRoutes from './features/college/college.routes.js';
import collegeGalleryRoutes from './features/collegeGallery/collegeGallery.routes.js';
import courseRoutes from './features/course/course.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import accountRoutes from './features/user/account/account.routes.js';
import studentRoutes from './features/student/student.routes.js';
import ratingRoutes from './features/rating/rating.routes.js';
import editorRoutes from './features/editor/editor.routes.js';
import dataRoutes from './features/data/data.routes.js';
import collegeUserRoutes from './features/collegeUser/collegeUser.routes.js';
import collegeUpdateRoutes from './features/collegeUpdate/collegeUpdate.routes.js';
import examRoutes from './features/exam/exam.routes.js';
import bloggerUserRoutes from './features/bloggerUser/bloggerUser.routes.js';

const router = Router();

// Profile and authentication routes
router.use('/', authRoutes);
router.use('/', accountRoutes);

// User CRUD routes for roles
router.use('/students', studentRoutes);
router.use('/editors', editorRoutes);
router.use('/collegeUsers', collegeUserRoutes);
router.use('/bloggerUser', bloggerUserRoutes);

// College routes
router.use('/colleges', collegeRoutes);
router.use('/college-gallery', collegeGalleryRoutes);
router.use('/college-updates', collegeUpdateRoutes);

// Other routes
router.use('/courses', courseRoutes);
router.use('/ratings', ratingRoutes);
router.use('/exams', examRoutes);
router.use('/data', dataRoutes);

export default router;
