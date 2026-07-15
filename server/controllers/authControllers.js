import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import User from "../models/User.js";
import College from "../models/College.js";
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';

export const signup = async (req, res) => {
    try {
        const { name, email, phone, course, college } = req.body;
        if (!name || !email || !phone || !course || !college) {
            return res.status(400).json({ message: 'Name, email, phone number, course, and college are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let collegeId = college;
        // If college is not a valid ObjectId, assume it's a new college name
        if (!mongoose.Types.ObjectId.isValid(college)) {
            const newCollege = new College({
                name: college,
                collegeID: `C-${Date.now()}`
            });
            await newCollege.save();
            collegeId = newCollege._id;
        }

        const user = new User({
            name,
            email,
            phone,
            course,
            college: collegeId
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const checkUserLoggedIn = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            exists: true, 
            hasPassword: !!user.password // convert to boolean
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const setPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password) {
            return res.status(400).json({ message: 'Password already set for this user' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        generateTokenAndSetCookie(res, user._id);
        res.json({ message: 'Password set successfully and logged in', user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Password not set. Please set password first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateTokenAndSetCookie(res, user._id);
        res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout =  (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
};