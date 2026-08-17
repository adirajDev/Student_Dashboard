import Blogger from './blogger.model.js';
import AppError from '../../../common/errors/AppError.js';
import {validate} from "../../../common/validation/validation.util.js";
import {updateBloggerSchema} from "./blogger.validation.js";

export const getBloggerByUserId = async userId => {
    const blogger = await Blogger.findOne({
        user: userId,
    })
        .populate([
            {
                path: 'user',
                select: 'name email phone',
                model: 'User',
            },
        ])
        .lean();
    if (!blogger) {
        throw new AppError('Blogger does not exist', 404);
    }
    return blogger;
};

export const updateBloggerByUserId = async (userId, updates) => {
    const payload = validate(updateBloggerSchema, updates);

    const blogger = await Blogger.findOneAndUpdate(
        { user: userId },
        { $set: payload},
    ).lean()

    if (!blogger) {
        throw new AppError('Blogger profile not found', 404);
    }

    return blogger;
}
