import mongoose from 'mongoose';
import User from '../models/User.js';
import { 
    normalizeStudentPayload, 
    validateStudentPayload 
} from '../utils/studentUtils.js';

const isDuplicateKeyError = (err) => err?.code === 11000;

// Fetch all students (users with role: 'student')
export const getStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort({ name: 1 });
        res.status(200).json(students);
    } catch (err) {
        next(err);
    }
};

// Add a new student
export const createStudent = async (req, res, next) => {
    try {
        const payload = normalizeStudentPayload(req.body);
        const validationError = validateStudentPayload(payload);

        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const emailExists = await User.exists({
            email: payload.email,
        });

        if (emailExists) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        const student = await User.create({
            ...payload,
            role: 'student'
        });

        // Omit password from response
        const studentObj = student.toObject();
        delete studentObj.password;

        res.status(201).json(studentObj);
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        next(err);
    }
};

export const updateStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        const payload = normalizeStudentPayload(req.body);
        const validationError = validateStudentPayload(payload);

        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const emailExists = await User.exists({
            email: payload.email,
            _id: { $ne: studentId },
        });

        if (emailExists) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        // Must include { role: 'student' } so admins can't edit other admins
        const student = await User.findOneAndUpdate(
            { _id: studentId, role: 'student' },
            payload,
            { returnDocument: 'after', runValidators: true }
        ).select('-password');

        if (!student) {
            return res.status(404).json({ error: 'Student not found or insufficient permissions.' });
        }

        res.status(200).json(student);
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        next(err);
    }
};

// Delete a student
export const deleteStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Must include { role: 'student' } so admins can't delete other admins
        const student = await User.findOneAndDelete({
            _id: studentId,
            role: 'student'
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found or insufficient permissions.' });
        }

        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
