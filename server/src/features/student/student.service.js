import { normalizeUserPayload, validateUserPayload } from '../../common/utils/validation.util.js';
import { getUsersByRole, createUserByRole, updateUserByRole, deleteUserByRole, isDuplicateKeyError } from '../../common/utils/user.util.js';
import Rating from '../rating/rating.model.js';
import { recalculateCollegeRating } from '../../common/utils/rating.util.js';
import AppError from '../../common/utils/AppError.js';

export const getStudents = async () => {
    return await getUsersByRole('student');
};

export const createStudent = async (payload) => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'student');
    if (err) throw new AppError(err, 400);

    try {
        const student = await createUserByRole(normalizedPayload, 'student');
        return student;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error)) throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const updateStudent = async (id, payload) => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'student');
    if (err) throw new AppError(err, 400);

    try {
        const student = await updateUserByRole(id, normalizedPayload, 'student');
        return student;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error)) throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const userRatings = await Rating.find({student: id});
        const ratedCollegeIds = [...new Set(userRatings.map(r => r.college))];

        await Rating.deleteMany({student: id});

        for (const collegeId of ratedCollegeIds) {
            await recalculateCollegeRating(collegeId);
        }

        await deleteUserByRole(id, 'student');
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        throw error;
    }
};
