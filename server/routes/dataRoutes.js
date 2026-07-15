import express from 'express';
import { getColleges, getCourses } from '../controllers/dataControllers.js';

const router = express.Router();

router.get('/colleges', getColleges);
router.get('/courses', getCourses);

export default router;
