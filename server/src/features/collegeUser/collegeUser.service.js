import User from '../user/user.model.js';
import AppError from '../../common/errors/AppError.js';
import bcrypt from 'bcrypt';
import { getUsersByRole } from '../../common/utils/user.util.js';

export const getCollegeUsers = async (skip, limit, search) => {
    return await getUsersByRole('college', skip, limit, search);
};

export const createCollegeUser = async data => {
    const { name, email, phone, college } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email is already in use.', 400);
    }

    if (!college) {
        throw new AppError('College ID is required for a college user.', 400);
    }

    const otp = Math.random().toString(36).slice(-6).toUpperCase();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(otp, salt);

    const newCollegeUser = new User({
        name,
        email,
        phone,
        college,
        role: 'college',
        isFirstLogin: true, // They must reset their password on first login
        password: hashedPassword,
    });

    await newCollegeUser.save();

    // Convert to plain object so we can attach the OTP to the response
    const populatedUser = await User.findById(newCollegeUser._id)
        .select('-password')
        .populate('college', 'name')
        .lean();
    return { ...populatedUser, generatedOtp: otp };
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
    return await User.findById(id)
        .select('-password')
        .populate('college', 'name')
        .lean();
};

export const deleteCollegeUser = async id => {
    const user = await User.findById(id);
    if (!user || user.role !== 'college') {
        throw new AppError('College user not found.', 404);
    }
    await User.deleteOne({ _id: id });
};
