import { Router } from 'express';
import collegeRoutes from './features/college/college.routes.js';
import courseRoutes from './features/course/course.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/user/user.routes.js';
import studentRoutes from './features/student/student.routes.js';
import ratingRoutes from './features/rating/rating.routes.js';
import editorRoutes from './features/editor/editor.routes.js';
import dataRoutes from './features/data/data.routes.js';
import collegeUserRoutes from './features/collegeUser/collegeUser.routes.js';
import collegeUpdateRoutes from './features/collegeUpdate/collegeUpdate.routes.js';
import examRoutes from './features/exam/exam.routes.js';

const router = Router();

// Domain routes will be mounted here
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/colleges', collegeRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/ratings', ratingRoutes);
router.use('/editors', editorRoutes);
router.use('/exams', examRoutes);
router.use('/data', dataRoutes);
router.use('/collegeUsers', collegeUserRoutes);
router.use('/college-updates', collegeUpdateRoutes);

export default router;
