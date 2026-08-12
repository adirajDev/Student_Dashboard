import express from 'express';
import {createBloggerUser } from './bloggerUser.contollers.js';

const router = express.Router();
// router.get('/getBloggerUsers', getAllBloggerUsers);
router.post('/', createBloggerUser);
// router.put('/:id', updateBloggerUser);

export default router;
