import mongoose from 'mongoose';

const StudentSchema = mongoose.Schema({
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
    },
    course: {
        type: String,
        required: true,
        enum: ['BTech', 'BBA', 'Commerce', 'Management', 'Designing'],
    },
});

const Student = mongoose.model('Student', StudentSchema);
export default Student;
