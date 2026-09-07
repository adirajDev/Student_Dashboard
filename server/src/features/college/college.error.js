import AppError from '../../common/errors/AppError.js';

export const UNIQUE_FIELDS = ['name', 'slug', 'collegeId'];

export const FIELD_LABELS = {
    name: 'name',
    slug: 'URL slug',
    collegeId: 'college ID',
};

export const throwIfDuplicate = err => {
    if (err.code !== 11000) throw err;

    const field = Object.keys(err.keyPattern ?? {})[0];
    const label = FIELD_LABELS[field];

    if (!label)
        throw new AppError('A college with these details already exists', 409);

    throw new AppError(
        `A college with the ${label} "${err.keyValue?.[field]}" already exists`,
        409
    );
};
