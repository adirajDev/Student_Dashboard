import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'editor'],
        default: 'student',
    },
    password: {
        type: String,
        // Optional initially because they set it on first login
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
