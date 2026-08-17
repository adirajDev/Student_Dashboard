import express from 'express';
import {
    applyToCollege,
    setApplicationCourse,
    addAdminStudentApplication,
    updateAdminStudentApplicationCourse,
    deleteAdminStudentApplication,
} from './application.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/:collegeId', requireRole('student'), applyToCollege);

router.patch(
    '/:applicationId/course',
    requireRole('student'),
    setApplicationCourse
);

// Admin application management for a student
router.post('/:studentId', requireRole('admin'), addAdminStudentApplication);
router.patch(
    '/:studentId/:applicationId/course',
    requireRole('admin'),
    updateAdminStudentApplicationCourse
);
router.delete(
    '/:studentId/:applicationId',
    requireRole('admin'),
    deleteAdminStudentApplication
);

export default router;
