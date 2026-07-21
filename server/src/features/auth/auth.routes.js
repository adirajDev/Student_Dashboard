import express from 'express';
import { 
    checkUserLoggedIn, 
    logout, 
    setPassword, 
    signin, 
    signup,
    resetInitialPassword,
    resetOtpPassword
} from './auth.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/check-user', checkUserLoggedIn);
router.post('/set-password', setPassword);
router.post('/reset-initial-password', requireAuth, resetInitialPassword);
router.post('/reset-otp-password', resetOtpPassword);
router.post('/signin', signin);
router.post('/logout', logout);

export default router;
