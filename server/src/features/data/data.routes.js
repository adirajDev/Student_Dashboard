import express from 'express';
import { globalSearch, getStats } from './data.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.get('/search', globalSearch);
router.get('/stats', requireAuth, requireRole('admin'), getStats);

export default router;
