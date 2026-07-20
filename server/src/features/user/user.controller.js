import * as userService from './user.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

export const updateSetting = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateSetting(req.user._id, req.body);
    res.json({ message: 'Settings updated successfully', user: updatedUser });
});
