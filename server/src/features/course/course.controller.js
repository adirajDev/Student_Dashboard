import * as courseService from './course.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getCourses();
    res.json(courses);
});

export const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
});
