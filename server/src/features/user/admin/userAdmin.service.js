import User from '../user.model.js';
import { validate } from '../../../common/validation/validation.util.js';
import mongoose from 'mongoose';
import { getRoleConfig } from '../user.roles.js';
import AppError from '../../../common/errors/AppError.js';

const findOneForRole = (id, role, config) => {
    const query = User.findOne({ _id: id, role }).select('-password');
    if (config.populate) query.populate(config.populate);
    return query.lean();
};

export const listUsers = async (role, skip = 0, limit = 0, search = '') => {
    const config = getRoleConfig(role);

    const queryObj = { role };
    if (search) {
        queryObj.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const [data, totalCount] = await Promise.all([
        User.find(queryObj)
            .select(config.select)
            .populate(config.populate)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(queryObj),
    ]);

    return { data, totalCount };
};

export const createUser = async (body, role) => {
    const config = getRoleConfig(role);
    const payload = validate(config.create, body);

    if (await User.exists({ email: payload.email })) {
        throw new AppError('A user with this email already exists.', 409);
    }

    const session = await mongoose.startSession();
    try {
        let created;
        await session.withTransaction(async () => {
            const [user] = await User.create([{ ...payload, role }], {
                session,
            });
            if (config.afterCreate) await config.afterCreate(user, session);
            created = user;
        });
        return findOneForRole(created._id, role, config);
    } catch (error) {
        // loses the race against the unique index
        if (error?.code === 11000) {
            throw new AppError('A user with this email already exists.', 409);
        }
        throw error;
    } finally {
        await session.endSession();
    }
};

const findDocForRole = async (id, role) => {
    const user = await User.findOne({ _id: id, role });
    if (!user) throw new AppError(`No ${role} found with this id.`, 404);
    return user;
};

export const updateUser = async (id, body, role) => {
    const config = getRoleConfig(role);
    const payload = validate(config.update, body);

    const user = await findDocForRole(id, role);

    if (payload.email && payload.email !== user.email) {
        const taken = await User.exists({
            email: payload.email,
            _id: { $ne: user._id },
        });
        if (taken) {
            throw new AppError('A user with this email already exists.', 409);
        }
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            user.set(payload);
            await user.save({ session });
            if (config.afterUpdate) await config.afterUpdate(user, session);
        });
        return findOneForRole(user._id, role, config);
    } catch (error) {
        if (error?.code === 11000) {
            throw new AppError('A user with this email already exists.', 409);
        }
        throw error;
    } finally {
        await session.endSession();
    }
};

export const deleteUser = async (id, role) => {
    const config = getRoleConfig(role);
    const user = await findDocForRole(id, role);

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            if (config.beforeDelete) await config.beforeDelete(user, session);
            await user.deleteOne({ session });
        });
    } finally {
        await session.endSession();
    }
};