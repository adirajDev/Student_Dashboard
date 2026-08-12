import * as studentService from './student.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import {
    getPaginationOptions,
    formatPaginatedResponse,
} from '../../common/utils/pagination.util.js';

export const getStudents = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const search = req.query.search || '';
    const { data, totalCount } = await studentService.getStudents(
        skip,
        limit,
        search
    );
    res.status(200).json(
        formatPaginatedResponse(data, totalCount, page, limit)
    );
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

export const applyToCollege = async (req, res, next) => {
    const result = await studentService.applyToCollege(
        req.user._id,
        req.params.collegeId
    );
    res.status(200).json(result);
};

export const setApplicationCourse = async (req, res, next) => {
    const { applicationId } = req.params;
    const { courseId } = req.body;
    const result = await studentService.setApplicationCourse(
        req.user._id,
        applicationId,
        courseId
    );
    res.status(200).json(result);
};

export const addAdminStudentApplication = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const { collegeId, courseId } = req.body;
    const result = await studentService.addAdminStudentApplication(
        studentId,
        collegeId,
        courseId
    );
    res.status(201).json(result);
});

export const updateAdminStudentApplicationCourse = asyncHandler(
    async (req, res) => {
        const { studentId, applicationId } = req.params;
        const { courseId } = req.body;
        const result = await studentService.updateAdminStudentApplicationCourse(
            studentId,
            applicationId,
            courseId
        );
        res.status(200).json(result);
    }
);

export const deleteAdminStudentApplication = asyncHandler(async (req, res) => {
    const { studentId, applicationId } = req.params;
    const result = await studentService.deleteAdminStudentApplication(
        studentId,
        applicationId
    );
    res.status(200).json(result);
});
