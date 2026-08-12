import {
    createUserSchema,
    updateUserSchema,
    createCollegeUserSchema,
    updateCollegeUserSchema,
} from './admin/userAdmin.validation.js';
import AppError from '../../common/errors/AppError.js';
import Blogger from "../blogger/blogger.model.js";

export const ROLE_CONFIG = {
    editor: { create: createUserSchema, update: updateUserSchema },
    student: { create: createUserSchema, update: updateUserSchema },
    blogger: {
        create: createUserSchema,
        update: updateUserSchema,
        afterCreate: async (user, session) => {
            await Blogger.create([{ user: user._id }], { session });
        },
        beforeDelete: async (user, session) => {
            await Blogger.deleteOne({ user: user._id }, { session });
        },
    },
    college: {
        create: createCollegeUserSchema,
        update: updateCollegeUserSchema,
        populate: { path: 'college', select: 'name location type' },
    },
};

export const getRoleConfig = role => {
    const config = ROLE_CONFIG[role];
    if (!config) throw new AppError(`Unsupported user role: ${role}`, 400);
    return config;
};
