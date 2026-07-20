import { Router } from 'express';
import collegeRoutes from './features/college/college.routes.js';
import courseRoutes from './features/course/course.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/user/user.routes.js';

const router = Router();

// Domain routes will be mounted here
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/colleges', collegeRoutes);
router.use('/courses', courseRoutes);

export default router;
