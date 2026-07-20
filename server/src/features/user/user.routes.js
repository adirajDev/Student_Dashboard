import express from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { getUser, updateSetting } from './user.controller.js';

const router = express.Router();

// Protected route to get current user details
router.get('/me', requireAuth, getUser);

// Protected route to update user settings
router.put('/update-settings', requireAuth, updateSetting);

export default router;
