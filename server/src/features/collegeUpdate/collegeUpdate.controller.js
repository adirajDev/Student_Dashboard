import * as collegeUpdateService from './collegeUpdate.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import { getPaginationOptions, formatPaginatedResponse } from '../../common/utils/pagination.util.js';

export const submitUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.submitUpdate(req.user, req.body);
    res.status(201).json({ message: 'Update submitted for approval.', update });
});

export const getMyUpdates = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const { data, totalCount } = await collegeUpdateService.getMyUpdates(req.user._id, skip, limit);
    res.status(200).json(formatPaginatedResponse(data, totalCount, page, limit));
});

export const getAllUpdates = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPaginationOptions(req);
    const { data, totalCount } = await collegeUpdateService.getAllUpdates(skip, limit);
    res.status(200).json(formatPaginatedResponse(data, totalCount, page, limit));
});

export const approveUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.approveUpdate(req.params.id);
    res.status(200).json({ message: 'Update approved successfully.', update });
});

export const rejectUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.rejectUpdate(
        req.params.id,
        req.body.adminFeedback
    );
    res.status(200).json({ message: 'Update rejected.', update });
});
