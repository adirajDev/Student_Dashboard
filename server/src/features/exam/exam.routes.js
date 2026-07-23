import express from 'express';
import {
    createExam
} from "./exam.controller.js";

const router = express.Router();
router.post('/create-exam', createExam);

export default router;