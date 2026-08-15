import * as userService from './user.service.js';
import asyncHandler from '../../../common/utils/asyncHandler.js';

export const makeUserController = role => ({
    list: asyncHandler(async (req, res) => {
        const { skip = 0, limit = 0, search = '' } = req.query;
        const data = await userService.listUsers(
            role,
            Number(skip),
            Number(limit),
            search
        );
        res.status(200).json({ success: true, ...data });
    }),
    create: asyncHandler(async (req, res) => {
        const user = await userService.createUser(req.body, role);
        res.status(201).json({ success: true, data: user });
    }),
    update: asyncHandler(async (req, res) => {
        const user = await userService.updateUser(
            req.params.id,
            req.body,
            role
        );
        res.status(200).json({ success: true, data: user });
    }),
    remove: asyncHandler(async (req, res) => {
        await userService.deleteUser(req.params.id, role);
        res.status(200).json({ success: true, message: `${role} deleted.` });
    }),
});
