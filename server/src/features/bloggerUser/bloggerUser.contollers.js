import * as bloggerUserService from './bloggerUser.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
// import {updateBloggerUser} from "./bloggerUser.service.js";

export const createBloggerUser = asyncHandler(async (req, res) => {
    const user = await bloggerUserService.createBloggerUser(req.body);
    res.status(201).json(user);
});

// export const updateBloggerUser = asyncHandler(async (req, res) => {
//     const user = await bloggerUserService.updateBloggerUser(req.params.id, req.body);
//     res.status(201).json(user);
// })
