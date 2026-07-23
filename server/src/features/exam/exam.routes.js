import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
} from "./exam.controller.js";

const router = express.Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/create-exam', createExam);

export default router;