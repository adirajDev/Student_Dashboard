import AppError from '../errors/AppError.js';

export const validate = (schema, data) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        throw new AppError(error.details.map(d => d.message).join(', '), 400);
    }
    return value;
};

// Validation middleware
export const validateBody = schema => (req, res, next) => {
    req.body = validate(schema, req.body);
    next();
};
