import * as authService from './auth.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import generateTokenAndSetCookie from '../../common/utils/token.util.js';

export const signup = asyncHandler(async (req, res) => {
    const user = await authService.signup(req.body);
    res.status(201).json({ message: 'User created successfully', user });
});

export const checkUserLoggedIn = asyncHandler(async (req, res) => {
    const result = await authService.checkUserLoggedIn(req.body.email);
    res.json(result);
});

export const setPassword = asyncHandler(async (req, res) => {
    const user = await authService.setPassword(
        req.body.email,
        req.body.password
    );
    generateTokenAndSetCookie(res, user._id);
    res.json({
        message: 'Password set successfully and logged in',
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
});

export const signin = asyncHandler(async (req, res) => {
    const user = await authService.signin(req.body.email, req.body.password);
    generateTokenAndSetCookie(res, user._id);
    res.json({
        message: 'Logged in successfully',
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
        },
    });
});

export const resetInitialPassword = asyncHandler(async (req, res) => {
    const user = await authService.resetInitialPassword(
        req.user._id,
        req.body.newPassword
    );
    res.json({
        message: 'Password updated successfully',
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
        },
    });
});

export const resetOtpPassword = asyncHandler(async (req, res) => {
    const user = await authService.resetOtpPassword(
        req.body.email,
        req.body.otp,
        req.body.newPassword
    );
    generateTokenAndSetCookie(res, user._id);
    res.json({
        message: 'Password updated successfully and logged in',
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
        },
    });
});

export const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
};
