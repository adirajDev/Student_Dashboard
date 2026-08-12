import {
    normalizeUserPayload,
    validateUserPayload,
} from '../../common/validation/validation.util.js';
import AppError from '../../common/errors/AppError.js';
import {
    createUserByRole,
    isDuplicateKeyError,
} from '../../common/utils/user.util.js';

export const createBloggerUser = async data => {
    const normalizedPayload = normalizeUserPayload(data);

    const err = validateUserPayload(normalizedPayload, 'blogger');
    if (err) throw new AppError(err, 400);

    try {
        const bloggerUser = await createUserByRole(
            normalizedPayload,
            'blogger'
        );
        return bloggerUser;
    } catch (error) {
        if (error.status) throw new AppError(error.message, error.status);
        if (isDuplicateKeyError(error))
            throw new AppError('A user with this email already exists.', 409);
        throw error;
    }
};

// export const updateBloggerUser = async (id, payload) => {
//
// }
