import express from 'express';
import {
    checkUserLoggedIn,
    logout,
    setPassword,
    signin,
    signup,
    resetInitialPassword,
    resetOtpPassword,
} from './auth.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { authLimiter } from '../../common/middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/check-user', authLimiter, checkUserLoggedIn);
router.post('/set-password', authLimiter, setPassword);
router.post('/reset-initial-password', requireAuth, resetInitialPassword);
router.post('/reset-otp-password', resetOtpPassword);
router.post('/signin', authLimiter, signin);
router.post('/logout', logout);

export default router;
