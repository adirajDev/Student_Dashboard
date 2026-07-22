import express from 'express';
import {
    submitUpdate,
    getMyUpdates,
    getAllUpdates,
    approveUpdate,
    rejectUpdate,
} from './collegeUpdate.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();
router.use(requireAuth);

// College Users can submit and view their own requests
router.post('/submit', requireRole('college'), submitUpdate);
router.get('/me', requireRole('college'), getMyUpdates);

// Admins can view all, approve, and reject
router.get('/', requireRole('admin'), getAllUpdates);
router.put('/:id/approve', requireRole('admin'), approveUpdate);
router.put('/:id/reject', requireRole('admin'), rejectUpdate);

export default router;
