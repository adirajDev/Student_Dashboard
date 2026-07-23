import * as examService from './exam.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getAllExams = asyncHandler(async (req, res) => {
    const exams = await examService.getAllExams();
    return res.status(200).json(exams);
});

export const getExamById = asyncHandler(async (req, res) => {
    const exam = await examService.getExamById(req.params.id);
    return res.status(200).json(exam);
});

export const createExam = asyncHandler(async (req, res) => {
    const exam = await examService.createExam(req.body);
    res.status(201).json({ message: 'Exam created successfully', exam });
});

export const updateExam = asyncHandler(async (req, res) => {
    const updatedExam = await examService.updateExam(req.body, req.params.id);
    res.status(200).json({ message: 'Exam updated successfully', updatedExam });
});

export const deleteExam = asyncHandler(async (req, res) => {
    await examService.deleteExam(req.params.id);
    res.status(200).json({ message: 'Exam deleted successfully' });
});
