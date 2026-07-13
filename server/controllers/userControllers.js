import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getUser = (req, res) => {
    res.json(req.user);
}

export const updateSetting = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id); // We need the password field here, so refetch

        let isUpdated = false;

        // Handle Email Update
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
            isUpdated = true;
        }

        // Handle Password Update
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to set a new password' });
            }
            
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            isUpdated = true;
        }

        if (isUpdated) {
            await user.save();
        }

        // Return updated user (without password)
        const updatedUser = await User.findById(user._id).select('-password');
        res.json({ message: 'Settings updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}