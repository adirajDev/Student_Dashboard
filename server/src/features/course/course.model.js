import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    level: {
        type: String,
        enum: ['diploma', 'bachelors', 'masters'],
        required: true,
        default: 'bachelors'
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
