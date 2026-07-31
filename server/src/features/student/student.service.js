import {
    normalizeUserPayload,
    validateUserPayload,
} from '../../common/utils/validation.util.js';
import {
    getUsersByRole,
    createUserByRole,
    updateUserByRole,
    deleteUserByRole,
    isDuplicateKeyError,
} from '../../common/utils/user.util.js';
import Rating from '../rating/rating.model.js';
import { recalculateCollegeRating } from '../../common/utils/rating.util.js';
import AppError from '../../common/utils/AppError.js';
import College from "../college/college.model.js";
import mongoose from "mongoose";
import User from "../user/user.model.js";

export const getStudents = async (skip, limit, search) => {
    return await getUsersByRole('student', skip, limit, search);
};

export const createStudent = async payload => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'student');
    if (err) throw new AppError(err, 400);

    try {
        const student = await createUserByRole(normalizedPayload, 'student');
        return student;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error))
            throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const updateStudent = async (id, payload) => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'student');
    if (err) throw new AppError(err, 400);

    try {
        const student = await updateUserByRole(
            id,
            normalizedPayload,
            'student'
        );
        return student;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error))
            throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const deleteStudent = async id => {
    try {
        const userRatings = await Rating.find({ student: id });
        const ratedCollegeIds = [...new Set(userRatings.map(r => r.college))];

        await Rating.deleteMany({ student: id });

        for (const collegeId of ratedCollegeIds) {
            await recalculateCollegeRating(collegeId);
        }

        await deleteUserByRole(id, 'student');
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        throw error;
    }
};

export const applyToCollege = async (userId, collegeId) => {
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        throw new AppError('Invalid college id', 400);
    }

    const college = await College.findById(collegeId);
    if (!college) {
        throw new AppError('College not found', 404);
    }

    const user = await User.findById(userId);

    const pendingExists = user.applications.some(
        app => app.college.toString() === collegeId && app.course === null
    );
    if (pendingExists) {
        const applications = await getPopulatedStudentApplications(userId);
        return { alreadyApplied: true, applications };
    }

    if (user.applications.length >= 3) {
        throw new AppError('You can have a maximum of 3 applications.', 400);
    }

    user.applications.push({ college: collegeId, course: null });
    await user.save();
    const applications = await getPopulatedStudentApplications(userId);
    return { alreadyApplied: false, applications };
};

export const setApplicationCourse = async (userId, applicationId, courseId) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new AppError('Invalid course id', 400);
    }

    const user = await User.findById(userId);
    const application = user.applications.id(applicationId); // subdocument lookup by _id
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
    const applications = await getPopulatedStudentApplications(userId);
    return { applications };
};

export const addAdminStudentApplication = async (studentId, collegeId, courseId = null) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new AppError('Invalid student ID format.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        throw new AppError('Invalid college ID format.', 400);
    }

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
        throw new AppError('Student not found.', 404);
    }

    const college = await College.findById(collegeId);
    if (!college) {
        throw new AppError('College not found.', 404);
    }

    if (student.applications.length >= 3) {
        throw new AppError('Student can have a maximum of 3 applications.', 400);
    }

    if (courseId) {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid course ID format.', 400);
        }
        const courseAllowed = college.availableCourses.some(
            ac => ac.course.toString() === courseId
        );
        if (!courseAllowed) {
            throw new AppError('Selected course is not offered by this college.', 400);
        }
    }

    const duplicatePair = student.applications.some(
        app =>
            app.college.toString() === collegeId &&
            (courseId ? app.course?.toString() === courseId : app.course === null)
    );
    if (duplicatePair) {
        throw new AppError('An application with this college and course already exists for this student.', 400);
    }

    student.applications.push({ college: collegeId, course: courseId || null });
    await student.save();

    const applications = await getPopulatedStudentApplications(studentId);
    return { applications };
};

export const updateAdminStudentApplicationCourse = async (studentId, applicationId, courseId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new AppError('Invalid student ID format.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new AppError('Invalid course ID format.', 400);
    }

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
        throw new AppError('Student not found.', 404);
    }

    const application = student.applications.id(applicationId);
    if (!application) {
        throw new AppError('Application not found.', 404);
    }

    const college = await College.findById(application.college);
    const courseAllowed = college.availableCourses.some(
        ac => ac.course.toString() === courseId
    );
    if (!courseAllowed) {
        throw new AppError('Selected course is not offered by this college.', 400);
    }

    const duplicatePair = student.applications.some(
        app =>
            app._id.toString() !== applicationId &&
            app.college.toString() === application.college.toString() &&
            app.course?.toString() === courseId
    );
    if (duplicatePair) {
        throw new AppError('An application with this college and course already exists for this student.', 400);
    }

    application.course = courseId;
    await student.save();

    const applications = await getPopulatedStudentApplications(studentId);
    return { applications };
};

export const deleteAdminStudentApplication = async (studentId, applicationId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new AppError('Invalid student ID format.', 400);
    }

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
        throw new AppError('Student not found.', 404);
    }

    const application = student.applications.id(applicationId);
    if (!application) {
        throw new AppError('Application not found.', 404);
    }

    application.deleteOne();
    await student.save();

    const applications = await getPopulatedStudentApplications(studentId);
    return { applications };
};

const getPopulatedStudentApplications = async (studentId) => {
    const updatedUser = await User.findById(studentId)
        .select('applications')
        .populate([
            {
                path: 'applications.college',
                select: 'name logo location availableCourses',
                populate: {
                    path: 'availableCourses.course',
                    select: 'name',
                    model: 'Course',
                },
            },
            { path: 'applications.course', select: 'name' },
        ])
        .lean();
    return updatedUser?.applications || [];
};