import { Router } from 'express';
import collegeRoutes from './features/college/college.routes.js';

const router = Router();

// Domain routes will be mounted here
router.use('/colleges', collegeRoutes);

export default router;
