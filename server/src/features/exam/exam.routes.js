import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam
} from "./exam.controller.js";

const router = express.Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/create-exam', createExam);
router.patch('/update-exam/:id', updateExam);

export default router;