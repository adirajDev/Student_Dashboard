import express from 'express';
import { createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();
router.use(requireAuth);

// ONLY Admin can access these routes
router.use(requireRole('admin'));

router.post('/create-course', createCourse);
router.put('/update-course/:id', updateCourse);
router.delete('/delete-course/:id', deleteCourse);

export default router;
