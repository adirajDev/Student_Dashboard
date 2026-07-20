import express from 'express';
import { globalSearch } from './data.controller.js';

const router = express.Router();

router.get('/search', globalSearch);

export default router;
