import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, phoneNumber, course } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            phoneNumber,
            course
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/check-user', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            exists: true, 
            hasPassword: !!user.password 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/set-password', async (req, res) => {
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
        res.json({ message: 'Password set successfully and logged in', user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/signin', async (req, res) => {
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
        res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
});

export default router;
