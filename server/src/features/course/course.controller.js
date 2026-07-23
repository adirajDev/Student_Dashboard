import * as courseService from './course.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import {
    getPaginationOptions,
    formatPaginatedResponse,
} from '../../common/utils/pagination.util.js';

export const getCourses = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const search = req.query.search || '';
    const { data, totalCount } = await courseService.getCourses(
        skip,
        limit,
        search
    );
    res.json(formatPaginatedResponse(data, totalCount, page, limit));
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
