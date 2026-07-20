import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 500,
    }, 
    isEdited: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

// Ensure a user can only rate a college once
ratingSchema.index({student:1, college:1}, {unique: true});

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
