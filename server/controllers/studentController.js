import { normalizeUserPayload, validateUserPayload } from '../utils/validationUtils.js';
import { getUsersByRole, createUserByRole, updateUserByRole, deleteUserByRole, isDuplicateKeyError } from '../utils/userManagementUtils.js';
import Rating from '../models/Rating.js';
import { recalculateCollegeRating } from '../utils/ratingCalculator.js';

export const getStudents = async (req, res, next) => {
    try {
        const students = await getUsersByRole('student');
        res.status(200).json(students);
    } catch (err) { next(err); }
};

export const createStudent = async (req, res, next) => {
    try {
        const payload = normalizeUserPayload(req.body);
        const err = validateUserPayload(payload, 'student');
        if (err) return res.status(400).json({ error: err });

        const student = await createUserByRole(payload, 'student');
        res.status(201).json(student);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        if (isDuplicateKeyError(err)) return res.status(409).json({ error: 'A user with this email already exists.' });
        next(err);
    }
};

export const updateStudent = async (req, res, next) => {
    try {
        const payload = normalizeUserPayload(req.body);
        const err = validateUserPayload(payload, 'student');
        if (err) return res.status(400).json({ error: err });

        const student = await updateUserByRole(req.params.id, payload, 'student');
        res.status(200).json(student);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        if (isDuplicateKeyError(err)) return res.status(409).json({ error: 'A user with this email already exists.' });
        next(err);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const userId = req.params.id
        
        const userRatings = await Rating.find({student: userId});
        const ratedCollegeIds = [...new Set(userRatings.map(r => r.college))];

        await Rating.deleteMany({student: userId})

        for (const collegeId of ratedCollegeIds) {
            await recalculateCollegeRating(collegeId);
        }

        await deleteUserByRole(userId, 'student');
        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
}