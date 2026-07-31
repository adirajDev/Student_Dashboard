import User from './user.model.js';
import College from "../college/college.model.js";
import bcrypt from 'bcrypt';
import AppError from '../../common/utils/AppError.js';
import mongoose from "mongoose";

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

export const updateApplicationCourse = async (userId, applicationId, courseId) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new AppError('Invalid course id', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new AppError('Invalid application id', 400);
    }

    const user = await User.findById(userId);
    const application = user.applications.id(applicationId);
    if (!application) {
        throw new AppError('Application not found', 404);
    }

    const college = await College.findById(application.college);
    const courseAllowed = college.availableCourses.some(
        ac => ac.course.toString() === courseId
    );
    if (!courseAllowed) {
        throw new AppError('Selected course is not offered by this college', 400);
    }

    const duplicatePair = user.applications.some(
        app =>
            app._id.toString() !== applicationId &&
            app.college.toString() === application.college.toString() &&
            app.course?.toString() === courseId
    );
    if (duplicatePair) {
        throw new AppError('You already have an application with this college and course', 400);
    }

    application.course = courseId;
    await user.save();
    return { applications: user.applications };
};

export const deleteApplication = async (userId, applicationId) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new AppError('Invalid application id', 400);
    }

    const user = await User.findById(userId);
    const application = user.applications.id(applicationId);
    if (!application) {
        throw new AppError('Application not found', 404);
    }

    application.deleteOne(); // Mongoose 6+ subdocument removal — pulls itself from the parent array
    await user.save();
    return { applications: user.applications };
};