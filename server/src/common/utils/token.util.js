import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'Production';
export const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
};

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('jwt', token, {
        ...authCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export default generateTokenAndSetCookie;
