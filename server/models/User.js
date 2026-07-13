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
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: String,
        required: true,
        enum: ['BTech', 'BBA', 'Commerce', 'Management', 'Designing'],
    },
    password: {
        type: String,
        // Optional initially because they set it on first login
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
