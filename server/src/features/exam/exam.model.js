import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    requirement: {
        type: String,
        required: true,
        trim: true,
    },
    regStartingDate: {
        type: Date,
        required: true,
    },
    regEndingDate: {
        type: Date,
        required: true,
    },
    examMode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true,
        default: 'Offline',
    },
    examDescription: {
        type: String,
        trim: true,
    },
    examLink: {
        type: String,
        trim: true,
    }

})