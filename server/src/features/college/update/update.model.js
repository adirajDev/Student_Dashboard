import mongoose from 'mongoose';

const collegeUpdateSchema = new mongoose.Schema(
    {
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        proposedChanges: {
            type: mongoose.Schema.Types.Mixed, // Allows flexible schema-less JSON object for changes
            required: true,
        },
        // Snapshot of the college's values for exactly the fields this request
        // touches, taken at submit time. Without it a request can only be
        // diffed while it is pending: once approved, the live college holds the
        // proposed values and every diff collapses to "nothing changed".
        previousValues: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminFeedback: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

collegeUpdateSchema.index({ requestedBy: 1, createdAt: -1 });
collegeUpdateSchema.index({ status: 1, createdAt: -1 });

const CollegeUpdate = mongoose.model('CollegeUpdate', collegeUpdateSchema);
export default CollegeUpdate;
