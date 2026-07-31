import User from '../../features/user/user.model.js';
import mongoose from 'mongoose';

export const isDuplicateKeyError = err => err?.code === 11000;

export const getUsersByRole = async (
    role,
    skip = 0,
    limit = 0,
    search = ''
) => {
    const queryObj = { role };
    if (search) {
        queryObj.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const query = User.find(queryObj);
    const [data, totalCount] = await Promise.all([
        query
            .clone()
            .select('name email phone role college applications createdAt updatedAt')
            .populate([
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
                { path: 'college', select: 'name' },
            ])
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(queryObj),
    ]);

    return { data, totalCount };
};

export const createUserByRole = async (payload, role) => {
    const emailExists = await User.exists({ email: payload.email });
    if (emailExists)
        throw {
            status: 409,
            message: 'A user with this email already exists.',
        };

    const user = await User.create({ ...payload, role });
    const populatedUser = await User.findById(user._id)
        .select('-password')
        .populate('college', 'name location type')
        .lean();
    return populatedUser;
};

export const updateUserByRole = async (id, payload, role) => {
    if (!mongoose.isValidObjectId(id))
        throw { status: 404, message: 'Invalid ID format.' };

    const emailExists = await User.exists({
        email: payload.email,
        _id: { $ne: id },
    });
    if (emailExists)
        throw {
            status: 409,
            message: 'A user with this email already exists.',
        };

    const user = await User.findOneAndUpdate({ _id: id, role }, payload, {
        returnDocument: 'after',
        runValidators: true,
    })
        .select('-password')
        .populate('college', 'name location type')
        .lean();

    if (!user)
        throw {
            status: 404,
            message: 'User not found or insufficient permissions.',
        };
    return user;
};

export const deleteUserByRole = async (id, role) => {
    if (!mongoose.isValidObjectId(id))
        throw { status: 404, message: 'Invalid ID format.' };

    const user = await User.findOneAndDelete({ _id: id, role });
    if (!user)
        throw {
            status: 404,
            message: 'User not found or insufficient permissions.',
        };
    return user;
};
