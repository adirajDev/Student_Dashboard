import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
} from './exam.controller.js';
import {requireAuth} from "../../common/middleware/auth.middleware.js";
import {requireRole} from "../../common/middleware/role.middleware.js";

const router = express.Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);

router.use(requireAuth);
router.use(requireRole('admin'));

router.post('/', createExam);
router.patch('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
