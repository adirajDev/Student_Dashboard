import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
