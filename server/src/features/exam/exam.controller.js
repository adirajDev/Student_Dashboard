import * as examService from './exam.service.js';
import asyncHandler from "../../common/utils/asyncHandler.js";

export const createExam = asyncHandler(async (req, res) => {
    const exam = await examService.createExam(req.body)
    res.status(201).json({ message: 'Exam created successfully', exam })
})