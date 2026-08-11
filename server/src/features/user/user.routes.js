import express from 'express';
import {
    requireAuth,
    checkAuth,
} from '../../common/middleware/auth.middleware.js';
import {
    deleteApplication,
    getUser,
    updateApplicationCourse,
    updateSetting,
} from './user.controller.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

// Route to get current user details without throwing 401 if not logged in
router.get('/me', checkAuth, getUser);

// Protected route to update user settings
router.put('/update-settings', requireAuth, updateSetting);

router.patch(
    '/applications/:applicationId/course',
    requireAuth,
    requireRole('student'),
    updateApplicationCourse
);

router.delete(
    '/applications/:applicationId',
    requireAuth,
    requireRole('student'),
    deleteApplication
);

export default router;
