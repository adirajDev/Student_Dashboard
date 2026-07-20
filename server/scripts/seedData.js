import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../src/features/college/college.model.js';
import Course from '../src/features/course/course.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const colleges = [
    { name: 'Stanford University', location: 'Stanford, California', collegeID: 'SU001', description: 'A private research university in Stanford, California.' },
    { name: 'Massachusetts Institute of Technology (MIT)', location: 'Cambridge, Massachusetts', collegeID: 'MIT001', description: 'A private land-grant research university in Cambridge, Massachusetts.' },
    { name: 'Harvard University', location: 'Cambridge, Massachusetts', collegeID: 'HU001', description: 'A private Ivy League research university in Cambridge, Massachusetts.' },
    { name: 'University of Oxford', location: 'Oxford, England', collegeID: 'UO001', description: 'A collegiate research university in Oxford, England.' },
    { name: 'Delhi Technological University (DTU)', location: 'New Delhi, India', collegeID: 'DTU001', description: 'A premier engineering university in Delhi.' }
];

const courses = [
    { name: 'Computer Science' },
    { name: 'MBA' },
    { name: 'BTech' },
    { name: 'BBA' },
    { name: 'Commerce' },
    { name: 'Management' },
    { name: 'Designing' }
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        // Clear existing data (optional, but good for seeding)
        await College.deleteMany({});
        await Course.deleteMany({});

        // Insert new data
        await College.insertMany(colleges);
        await Course.insertMany(courses);

        console.log('Successfully seeded Colleges and Courses!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
