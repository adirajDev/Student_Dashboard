import express from 'express';
import { globalSearch } from '../controllers/dataControllers.js';

const router = express.Router();

router.get('/search', globalSearch);
export default router;