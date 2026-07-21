import mongoose from 'mongoose';

const collegeUpdateSchema = new mongoose.Schema({
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposedChanges: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible schema-less JSON object for changes
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminFeedback: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const CollegeUpdate = mongoose.model('CollegeUpdate', collegeUpdateSchema);
export default CollegeUpdate;
