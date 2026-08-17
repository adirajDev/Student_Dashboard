import {
    createUserSchema,
    updateUserSchema,
    createCollegeUserSchema,
    updateCollegeUserSchema,
} from './management/user.validation.js';
import AppError from '../../common/errors/AppError.js';
import Blogger from '../blog/blogger/blogger.model.js';

const BASE_SELECT = 'name email phone role createdAt updatedAt';

export const ROLE_CONFIG = {
    editor: {
        create: createUserSchema,
        update: updateUserSchema,
        select: BASE_SELECT,
        populate: [],
    },
    blogger: {
        create: createUserSchema,
        update: updateUserSchema,
        select: BASE_SELECT,
        populate: [],
        afterCreate: async (user, session) => {
            await Blogger.create([{ user: user._id }], { session });
        },
        beforeDelete: async (user, session) => {
            await Blogger.deleteOne({ user: user._id }, { session });
        },
    },
    student: {
        create: createUserSchema,
        update: updateUserSchema,
        select: `${BASE_SELECT} applications`,
        populate: [
            {
                path: 'applications.college',
                select: 'name availableCourses',
                populate: {
                    path: 'availableCourses.course',
                    select: 'name',
                    model: 'Course',
                },
            },
            { path: 'applications.course', select: 'name' },
        ],
    },
    college: {
        create: createCollegeUserSchema,
        update: updateCollegeUserSchema,
        select: `${BASE_SELECT} college`,
        populate: [{ path: 'college', select: 'name location type' }],
    },
};

export const getRoleConfig = role => {
    const config = ROLE_CONFIG[role];
    if (!config) throw new AppError(`Unsupported user role: ${role}`, 400);
    return config;
};
