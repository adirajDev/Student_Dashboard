import express from 'express';
import { getColleges, getCourses, globalSearch } from '../controllers/dataControllers.js';

const router = express.Router();

router.get('/colleges', getColleges);
router.get('/courses', getCourses);
router.get('/search', globalSearch);
export default router;
