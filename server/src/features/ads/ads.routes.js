import express from 'express';
import {
    getSlots,
    getAdsForSlot,
    serveAdImage,
    getAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
} from './ads.controller.js';
import { validateBody } from '../../common/validation/validation.util.js';
import { createAdSchema, updateAdSchema } from './ads.validation.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.get('/slots', getSlots);
router.get('/slot/:slot', getAdsForSlot);
router.get('/:id/image', serveAdImage);

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', getAds);
router.get('/:id', getAdById);
router.post('/', validateBody(createAdSchema), createAd);
router.put('/:id', validateBody(updateAdSchema), updateAd);
router.delete('/:id', deleteAd);

export default router;
