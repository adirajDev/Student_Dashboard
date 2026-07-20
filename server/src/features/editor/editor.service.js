import { normalizeUserPayload, validateUserPayload } from '../../common/utils/validation.util.js';
import { getUsersByRole, createUserByRole, updateUserByRole, deleteUserByRole, isDuplicateKeyError } from '../../common/utils/user.util.js';
import AppError from '../../common/utils/AppError.js';

export const getEditors = async () => {
    return await getUsersByRole('editor');
};

export const createEditor = async (payload) => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'editor'); 
    if (err) throw new AppError(err, 400);

    try {
        const editor = await createUserByRole(normalizedPayload, 'editor');
        return editor;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error)) throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const updateEditor = async (id, payload) => {
    const normalizedPayload = normalizeUserPayload(payload);
    const err = validateUserPayload(normalizedPayload, 'editor');
    if (err) throw new AppError(err, 400);

    try {
        const editor = await updateUserByRole(id, normalizedPayload, 'editor');
        return editor;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error)) throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

export const deleteEditor = async (id) => {
    try {
        await deleteUserByRole(id, 'editor');
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        throw error;
    }
};
