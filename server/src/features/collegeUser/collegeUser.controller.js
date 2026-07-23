import * as collegeUserService from './collegeUser.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import {
    getPaginationOptions,
    formatPaginatedResponse,
} from '../../common/utils/pagination.util.js';

export const getCollegeUsers = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const search = req.query.search || '';
    const { data, totalCount } = await collegeUserService.getCollegeUsers(
        skip,
        limit,
        search
    );
    res.status(200).json(
        formatPaginatedResponse(data, totalCount, page, limit)
    );
});

export const createCollegeUser = asyncHandler(async (req, res) => {
    const user = await collegeUserService.createCollegeUser(req.body);
    res.status(201).json(user);
});

export const updateCollegeUser = asyncHandler(async (req, res) => {
    const user = await collegeUserService.updateCollegeUser(
        req.params.id,
        req.body
    );
    res.status(200).json(user);
});

export const deleteCollegeUser = asyncHandler(async (req, res) => {
    await collegeUserService.deleteCollegeUser(req.params.id);
    res.status(200).json({ message: 'College user deleted successfully.' });
});
