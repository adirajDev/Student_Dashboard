import express from 'express';
import { addRating, deleteRating, updateRating } from '../controllers/ratingControllers.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("student"));

router.post('/add-rating', addRating);
router.patch('/update-rating/:ratingId', updateRating);
router.delete('/delete-rating/:ratingId', deleteRating);

export default router;