import * as userService from './account.service.js';
import asyncHandler from '../../../common/utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

export const updateSetting = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateSetting(req.user._id, req.body);
    res.json({ message: 'Settings updated successfully', user: updatedUser });
});

export const updateApplicationCourse = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { courseId } = req.body;
        const result = await userService.updateApplicationCourse(
            req.user._id,
            applicationId,
            courseId
        );
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteApplication = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const result = await userService.deleteApplication(
            req.user._id,
            applicationId
        );
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
