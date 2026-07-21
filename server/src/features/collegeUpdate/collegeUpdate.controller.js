import * as collegeUpdateService from './collegeUpdate.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const submitUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.submitUpdate(req.user, req.body);
    res.status(201).json({ message: 'Update submitted for approval.', update });
});

export const getMyUpdates = asyncHandler(async (req, res) => {
    const updates = await collegeUpdateService.getMyUpdates(req.user._id);
    res.status(200).json(updates);
});

export const getAllUpdates = asyncHandler(async (req, res) => {
    const updates = await collegeUpdateService.getAllUpdates();
    res.status(200).json(updates);
});

export const approveUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.approveUpdate(req.params.id);
    res.status(200).json({ message: 'Update approved successfully.', update });
});

export const rejectUpdate = asyncHandler(async (req, res) => {
    const update = await collegeUpdateService.rejectUpdate(req.params.id, req.body.adminFeedback);
    res.status(200).json({ message: 'Update rejected.', update });
});
