import AppError from '../utils/AppError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    let value = '';
    if (err.keyValue) {
        value = Object.values(err.keyValue)[0];
    }
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = Object.assign({}, err);
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            error: error.message, // Included for frontend compatibility
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
            error: 'Something went very wrong!', // Included for frontend compatibility
        });
    }
};

export default errorMiddleware;
