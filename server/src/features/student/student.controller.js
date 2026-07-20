import * as studentService from './student.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getStudents = asyncHandler(async (req, res) => {
    const students = await studentService.getStudents();
    res.status(200).json(students);
});

export const createStudent = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
});

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
    await studentService.deleteStudent(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully.' });
});
