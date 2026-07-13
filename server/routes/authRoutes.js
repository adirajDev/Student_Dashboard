import express from 'express';
import { checkUserLoggedIn, logout, setPassword, signin, signup } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/check-user', checkUserLoggedIn);

router.post('/set-password', setPassword);

router.post('/signin', signin);

router.post('/logout', logout);

export default router;
