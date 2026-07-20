import express from 'express';
import { addRating, deleteRating, updateRating } from '../controllers/ratingControllers.js';
import { requireAuth } from '../src/common/middleware/auth.middleware.js';
import { requireRole } from '../src/common/middleware/role.middleware.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("student"));

router.post('/add-rating', addRating);
router.patch('/update-rating/:ratingId', updateRating);
router.delete('/delete-rating/:ratingId', deleteRating);

export default router;