import User from './user.model.js';
import bcrypt from 'bcrypt';
import AppError from '../../common/utils/AppError.js';

export const updateSetting = async (userId, data) => {
    const { email, currentPassword, newPassword } = data;
    const user = await User.findById(userId);

    let isUpdated = false;

    // Handle Email Update
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            throw new AppError('Email already in use', 400);
        }
        user.email = email;
        isUpdated = true;
    }

    // Handle Password Update
    if (newPassword) {
        if (!currentPassword) {
            throw new AppError(
                'Current password is required to set a new password',
                400
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError('Incorrect current password', 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        isUpdated = true;
    }

    if (isUpdated) {
        await user.save();
    }

    // Return updated user (without password)
    const updatedUser = await User.findById(user._id).select('-password');
    return updatedUser;
};
