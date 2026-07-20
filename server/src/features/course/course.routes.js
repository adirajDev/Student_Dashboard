import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourses } from './course.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();
router.get('/', getCourses);

router.use(requireAuth);
router.use(requireRole('admin'));

router.post('/create-course', createCourse);
router.put('/update-course/:id', updateCourse);
router.delete('/delete-course/:id', deleteCourse);

export default router;
