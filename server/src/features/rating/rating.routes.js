import express from 'express';
import { addRating, deleteRating, updateRating, getRatingsByCollege, getMyRatings } from './rating.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();

router.get('/college/:collegeId', getRatingsByCollege);

router.use(requireAuth);
router.use(requireRole("student"));

router.get('/my-ratings', getMyRatings);
router.post('/add-rating', addRating);
router.patch('/update-rating/:ratingId', updateRating);
router.delete('/delete-rating/:ratingId', deleteRating);

export default router;
