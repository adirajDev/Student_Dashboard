import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
} from './exam.controller.js';

const router = express.Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', createExam);
router.patch('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
