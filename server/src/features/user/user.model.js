import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
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
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
        },
        applications: [
            {
                college: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'College',
                    required: true
                },
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    default: null
                },
            },
        ],
        role: {
            type: String,
            enum: ['admin', 'student', 'editor', 'college'],
            default: 'student',
        },
        isFirstLogin: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            // Optional initially because they set it on first login
        },
    },
    { timestamps: true }
);

userSchema.path('applications').validate(function (arr) {
    return arr.length <= 3;
}, 'You can apply to a maximum of 3 applications.');

const User = mongoose.model('User', userSchema);
export default User;
