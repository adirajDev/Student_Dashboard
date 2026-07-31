import express from 'express';
import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    applyToCollege,
    setApplicationCourse,
    addAdminStudentApplication,
    updateAdminStudentApplicationCourse,
    deleteAdminStudentApplication,
} from './student.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post(
    '/:collegeId/apply',
    requireRole('student'),
    applyToCollege
);

router.patch(
    '/applications/:applicationId/course',
    requireRole('student'),
    setApplicationCourse
);

router.get(
    '/get-students',
    requireRole('admin', 'editor'),
    getStudents
);
router.post(
    '/create-student',
    requireRole('admin'),
    createStudent
);
router.put(
    '/update-student/:id',
    requireRole('admin', 'editor'),
    updateStudent
);
router.delete(
    '/delete-student/:id',
    requireRole('admin'),
    deleteStudent
);

// Admin application management for a student
router.post(
    '/:studentId/applications',
    requireRole('admin'),
    addAdminStudentApplication
);
router.patch(
    '/:studentId/applications/:applicationId/course',
    requireRole('admin'),
    updateAdminStudentApplicationCourse
);
router.delete(
    '/:studentId/applications/:applicationId',
    requireRole('admin'),
    deleteAdminStudentApplication
);

export default router;
