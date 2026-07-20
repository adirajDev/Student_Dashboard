import User from '../../features/user/user.model.js';
import mongoose from 'mongoose';

export const isDuplicateKeyError = (err) => err?.code === 11000;

export const getUsersByRole = async (role) => {
    return await User.find({ role }).populate('course college').select('-password').sort({ name: 1 });
};

export const createUserByRole = async (payload, role) => {
    const emailExists = await User.exists({ email: payload.email });
    if (emailExists) throw { status: 409, message: 'A user with this email already exists.' };

    const user = await User.create({ ...payload, role });
    const populatedUser = await User.findById(user._id).populate('course college').select('-password');
    return populatedUser.toObject();
};

export const updateUserByRole = async (id, payload, role) => {
    if (!mongoose.isValidObjectId(id)) throw { status: 404, message: 'Invalid ID format.' };
    
    const emailExists = await User.exists({ email: payload.email, _id: { $ne: id } });
    if (emailExists) throw { status: 409, message: 'A user with this email already exists.' };

    const user = await User.findOneAndUpdate(
        { _id: id, role },
        payload,
        { returnDocument: 'after', runValidators: true }
    ).populate('course college').select('-password');

    if (!user) throw { status: 404, message: 'User not found or insufficient permissions.' };
    return user;
};

export const deleteUserByRole = async (id, role) => {
    if (!mongoose.isValidObjectId(id)) throw { status: 404, message: 'Invalid ID format.' };
    
    const user = await User.findOneAndDelete({ _id: id, role });
    if (!user) throw { status: 404, message: 'User not found or insufficient permissions.' };
    return user;
};
