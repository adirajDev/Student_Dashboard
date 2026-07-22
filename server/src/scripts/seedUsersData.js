import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../features/user/user.model.js';

dotenv.config();

const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const users = [
    {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '9876543210',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f0111878076f53a9af918',
        role: 'student',
    },
    {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '8765432109',
        course: '6a5efa7e878076f53a9af50d',
        college: '6a5f0118878076f53a9af936',
        role: 'student',
    },
    {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        phone: '7654321098',
        course: '6a5efa7e878076f53a9af50a',
        college: '6a5f011a878076f53a9af93c',
        role: 'student',
    },
    {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@example.com',
        phone: '6543210987',
        course: '6a5efa7f878076f53a9af513',
        college: '6a5f011b878076f53a9af940',
        role: 'student',
    },
    {
        name: 'Rohan Desai',
        email: 'rohan.desai@example.com',
        phone: '9988776655',
        course: '6a5efa7e878076f53a9af50c',
        college: '6a5f0111878076f53a9af919',
        role: 'student',
    },
    {
        name: 'Anjali Singh',
        email: 'anjali.singh@example.com',
        phone: '8877665544',
        course: '6a5efa7f878076f53a9af513',
        college: '6a5f011d878076f53a9af942',
        role: 'student',
    },
    {
        name: 'Vikram Malhotra',
        email: 'vikram.m@example.com',
        phone: '7766554433',
        course: '6a5efa80878076f53a9af518',
        college: '6a5f0119878076f53a9af938',
        role: 'student',
    },
    {
        name: 'Neha Verma',
        email: 'neha.verma@example.com',
        phone: '6655443322',
        course: '6a5efa80878076f53a9af519',
        college: '6a5f0119878076f53a9af93a',
        role: 'student',
    },
    {
        name: 'Karan Reddy',
        email: 'karan.reddy@example.com',
        phone: '9123456780',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f011a878076f53a9af93d',
        role: 'student',
    },
    {
        name: 'Pooja Iyer',
        email: 'pooja.iyer@example.com',
        phone: '9234567801',
        course: '6a5efa80878076f53a9af51d',
        college: '6a5f0117878076f53a9af932',
        role: 'student',
    },
    {
        name: 'Aditya Raj',
        email: 'aditya.raj@example.com',
        phone: '9345678012',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f011a878076f53a9af93e',
        role: 'student',
    },
    {
        name: 'Kavya Joshi',
        email: 'kavya.joshi@example.com',
        phone: '9456780123',
        course: '6a5efa7f878076f53a9af510',
        college: '6a5f0118878076f53a9af937',
        role: 'student',
    },
    {
        name: 'Manish Tiwari',
        email: 'manish.tiwari@example.com',
        phone: '9567801234',
        course: '6a5efa7f878076f53a9af514',
        college: '6a5f011d878076f53a9af944',
        role: 'student',
    },
    {
        name: 'Shreya Nair',
        email: 'shreya.nair@example.com',
        phone: '9678012345',
        course: '6a5efa80878076f53a9af516',
        college: '6a5f0119878076f53a9af93b',
        role: 'student',
    },
    {
        name: 'Arjun Kapoor',
        email: 'arjun.kapoor@example.com',
        phone: '9780123456',
        course: '6a5efa7e878076f53a9af50b',
        college: '6a5f011f878076f53a9af946',
        role: 'student',
    },
    {
        name: 'Divya Bhatia',
        email: 'divya.bhatia@example.com',
        phone: '9890123456',
        course: '6a5efa7f878076f53a9af514',
        college: '6a5f011d878076f53a9af943',
        role: 'student',
    },
    {
        name: 'Siddharth Jain',
        email: 'siddharth.jain@example.com',
        phone: '9901234567',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f0111878076f53a9af91c',
        role: 'student',
    },
    {
        name: 'Tara Menon',
        email: 'tara.menon@example.com',
        phone: '9012345678',
        course: '6a5efa7f878076f53a9af512',
        college: '6a5f011a878076f53a9af93f',
        role: 'student',
    },
    {
        name: 'Rajat Bose',
        email: 'rajat.bose@example.com',
        phone: '9123450987',
        course: '6a5efa7e878076f53a9af50a',
        college: '6a5f0115878076f53a9af92a',
        role: 'student',
    },
    {
        name: 'Isha Agarwal',
        email: 'isha.agarwal@example.com',
        phone: '9234509876',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f0116878076f53a9af930',
        role: 'student',
    },
];

const seedUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        let added = 0;
        let updated = 0;

        for (const user of users) {
            const res = await User.updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true }
            );

            if (res.upsertedCount > 0) {
                added++;
            } else if (res.modifiedCount > 0) {
                updated++;
            }
        }

        console.log(
            `Successfully added ${added} new users, updated ${updated} existing users!`
        );
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
