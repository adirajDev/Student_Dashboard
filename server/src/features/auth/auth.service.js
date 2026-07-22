import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../user/user.model.js';
import College from '../college/college.model.js';
import AppError from '../../common/utils/AppError.js';

export const signup = async data => {
    const { name, email, phone, course, college } = data;

    if (!name || !email || !phone || !course || !college) {
        throw new AppError(
            'Name, email, phone number, course, and college are required.',
            400
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User with this email already exists', 400);
    }

    let collegeId = college;
    // If college is not a valid ObjectId, assume it's a new college name
    if (!mongoose.Types.ObjectId.isValid(college)) {
        const newCollege = new College({
            name: college,
            collegeId: `C-${Date.now()}`,
        });
        await newCollege.save();
        collegeId = newCollege._id;
    }

    const user = new User({
        name,
        email,
        phone,
        course,
        college: collegeId,
    });

    await user.save();
    return { id: user._id, email: user.email };
};

export const checkUserLoggedIn = async email => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return {
        exists: true,
        hasPassword: !!user.password,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
    };
};

export const setPassword = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.password) {
        throw new AppError('Password already set for this user', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    return user;
};

export const signin = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (!user.password) {
        throw new AppError('Password not set. Please set password first.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 400);
    }

    return user;
};

export const resetInitialPassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (!newPassword || newPassword.length < 6) {
        throw new AppError('Password must be at least 6 characters', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    return user;
};

export const resetOtpPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(otp, user.password);
    if (!isMatch) {
        throw new AppError('Invalid OTP', 400);
    }

    if (!newPassword || newPassword.length < 6) {
        throw new AppError('New password must be at least 6 characters', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    return user;
};
