import express from 'express';
import {
    createNews,
    deleteNewsById,
    getNews,
    getNewsById,
    updateNews,
} from './news.controller.js';
import { validateBody } from '../../common/validation/validation.util.js';
import { createNewsSchema, updateNewsSchema } from './news.validation.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);

router.use(requireAuth);
router.use(requireRole('admin'));

router.post('/', validateBody(createNewsSchema), createNews);
router.put('/:id', validateBody(updateNewsSchema), updateNews);
router.delete('/:id', deleteNewsById);

export default router;
