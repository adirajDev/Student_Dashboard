import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUser, updateSetting } from '../controllers/userControllers.js';

const router = express.Router();

// Protected route to get current user details
router.get('/me', requireAuth, getUser);

// Protected route to update user settings
router.put('/update-settings', requireAuth, updateSetting);

export default router;