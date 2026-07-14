import mongoose from 'mongoose';
import Student from '../models/Student.js';
import { 
    normalizeStudentPayload, 
    validateStudentPayload 
} from '../utils/studentUtils.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

const isDuplicateKeyError = (err) => err?.code === 11000;

// Fetch all students
export const getStudents = async (req, res, next) => {
    try {
        const students = await Student.find().sort({ name: 1 });
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

        const emailExists = await Student.exists({
            email: payload.email,
        });

        if (emailExists) {
            return res.status(409).json({ error: 'A student with this email already exists.' });
        }

        const student = await Student.create(payload);

        res.status(201).json(student);
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            return res.status(409).json({ error: 'A student with this email already exists.' });
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

        const emailExists = await Student.exists({
            email: payload.email,
            _id: { $ne: studentId },
        });

        if (emailExists) {
            return res.status(409).json({ error: 'A student with this email already exists.' });
        }

        const student = await Student.findOneAndUpdate(
            { _id: studentId },
            payload,
            { returnDocument: 'after', runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            return res.status(409).json({ error: 'A student with this email already exists.' });
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

        const student = await Student.findOneAndDelete({
            _id: studentId,
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
