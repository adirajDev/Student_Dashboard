import express from 'express';
import { requireAuth, checkAuth } from '../../common/middleware/auth.middleware.js';
import { getUser, updateSetting } from './user.controller.js';

const router = express.Router();

// Route to get current user details without throwing 401 if not logged in
router.get('/me', checkAuth, getUser);

// Protected route to update user settings
router.put('/update-settings', requireAuth, updateSetting);

export default router;
