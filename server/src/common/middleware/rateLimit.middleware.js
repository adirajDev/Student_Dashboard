import rateLimit from 'express-rate-limit';

/**
 * express-rate-limit responds directly and never reaches errorMiddleware,
 * so we shape the 429 body ourselves to match what the rest of the API
 * returns ({ status, message, error }). Otherwise the frontend gets a
 * plain-text body and `err.response.data.error` is undefined.
 */
const jsonHandler = message => (req, res) => {
    res.status(429).json({
        status: 'fail',
        message,
        error: message,
    });
};

/**
 * Strict limiter for credential endpoints. Low ceiling because these are
 * the endpoints worth brute-forcing.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-7', // sends RateLimit-* response headers
    legacyHeaders: false,
    skipSuccessfulRequests: true, // only failed attempts count
    handler: jsonHandler('Too many attempts. Please try again in 15 minutes.'),
});

/**
 * General limiter for everything else. Generous — this is DoS protection,
 * not access control.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: jsonHandler('Too many requests. Please slow down.'),
});
