import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    location: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    collegeID: {
        type: String,
        trim: true,
        sparse: true, // sparse unique index allows null/missing
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    availableCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
export default College;
