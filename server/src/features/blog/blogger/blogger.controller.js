import asyncHandler from '../../../common/utils/asyncHandler.js';
import * as bloggerService from './blogger.service.js';

export const getBloggerByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId ?? req.user.id;
    const blogger = await bloggerService.getBloggerByUserId(userId);
    res.status(200).json({ success: true, data: blogger });
});

export const updateBloggerByUserId = asyncHandler(async (req, res) => {
    const blogger = await bloggerService.updateBloggerByUserId(
        req.user.id,
        req.body
    );
    res.status(200).json({ success: true, data: blogger });
});
