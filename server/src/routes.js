import { Router } from 'express';
import collegeRoutes from './features/college/college.routes.js';
import courseRoutes from './features/course/course.routes.js';

const router = Router();

// Domain routes will be mounted here
router.use('/colleges', collegeRoutes);
router.use('/courses', courseRoutes);

export default router;
