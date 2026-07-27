import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../features/college/college.model.js';
import { colleges } from "./college.js";

dotenv.config();

const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const seedColleges = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        let added = 0;
        let updated = 0;

        for (const college of colleges) {
            const res = await College.updateOne(
                { name: college.name },
                { $set: college },
                { upsert: true }
            );

            if (res.upsertedCount > 0) {
                added++;
            } else if (res.modifiedCount > 0) {
                updated++;
            }
        }

        console.log(
            `Successfully added ${added} new colleges, updated ${updated} existing colleges!`
        );
        process.exit(0);
    } catch (error) {
        console.error('Error seeding colleges:', error);
        process.exit(1);
    }
};

seedColleges();
