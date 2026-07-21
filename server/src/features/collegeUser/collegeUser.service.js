import User from '../user/user.model.js';
import AppError from '../../common/utils/AppError.js';

export const getCollegeUsers = async () => {
    return await User.find({ role: 'college' }).populate('college', 'name');
};

export const createCollegeUser = async (data) => {
    const { name, email, phone, college } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email is already in use.', 400);
    }

    if (!college) {
        throw new AppError('College ID is required for a college user.', 400);
    }

    const newCollegeUser = new User({
        name,
        email,
        phone,
        college,
        role: 'college',
        isFirstLogin: true // They must reset their password on first login
    });

    await newCollegeUser.save();
    return await User.findById(newCollegeUser._id).populate('college', 'name');
};

export const updateCollegeUser = async (id, data) => {
    const { name, email, phone, college } = data;

    const user = await User.findById(id);
    if (!user || user.role !== 'college') {
        throw new AppError('College user not found.', 404);
    }

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email is already in use.', 400);
        }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.college = college || user.college;

    await user.save();
    return await User.findById(id).populate('college', 'name');
};

export const deleteCollegeUser = async (id) => {
    const user = await User.findById(id);
    if (!user || user.role !== 'college') {
        throw new AppError('College user not found.', 404);
    }
    await User.deleteOne({ _id: id });
};
