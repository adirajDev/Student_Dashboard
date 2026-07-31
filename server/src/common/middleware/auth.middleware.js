import jwt from 'jsonwebtoken';
import User from '../../features/user/user.model.js';

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId)
            .populate('course college')
            .populate({
                path: 'applications.college',
                populate: {
                    path: 'availableCourses.course',
                    model: 'Course'
                }
            })
            .populate('applications.course')
            .select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId)
            .populate('course college')
            .populate({
                path: 'applications.college',
                populate: {
                    path: 'availableCourses.course',
                    model: 'Course'
                }
            })
            .populate('applications.course')
            .select('-password');

        req.user = user || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};
