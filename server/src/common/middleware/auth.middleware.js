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
            .select('-password')
            .populate('college', 'name logo location type')
            .populate({
                path: 'applications.college',
                select: 'name logo location type availableCourses',
                populate: {
                    path: 'availableCourses.course',
                    select: 'name',
                    model: 'Course',
                },
            })
            .populate('applications.course', 'name');

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
            .select('-password')
            .populate('college', 'name logo location type')
            .populate({
                path: 'applications.college',
                select: 'name logo location type availableCourses',
                populate: {
                    path: 'availableCourses.course',
                    select: 'name',
                    model: 'Course',
                },
            })
            .populate('applications.course', 'name');

        req.user = user || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};
