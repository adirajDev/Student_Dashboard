import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../features/user/user.model.js';

dotenv.config();

const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const editors = [
    {
        name: 'Ravi Shankar',
        email: 'ravi.shankar.ed@example.com',
        phone: '9871112233',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f0111878076f53a9af918',
        role: 'editor',
    },
    {
        name: 'Meera Krishnan',
        email: 'meera.k.ed@example.com',
        phone: '9872223344',
        course: '6a5efa7e878076f53a9af50c',
        college: '6a5f0111878076f53a9af919',
        role: 'editor',
    },
    {
        name: 'Tariq Khan',
        email: 'tariq.khan.ed@example.com',
        phone: '9873334455',
        course: '6a5efa7e878076f53a9af50d',
        college: '6a5f0118878076f53a9af936',
        role: 'editor',
    },
    {
        name: 'Sonal Das',
        email: 'sonal.das.ed@example.com',
        phone: '9874445566',
        course: '6a5efa7e878076f53a9af50a',
        college: '6a5f011a878076f53a9af93c',
        role: 'editor',
    },
    {
        name: 'Prakash Jha',
        email: 'prakash.jha.ed@example.com',
        phone: '9875556677',
        course: '6a5efa7f878076f53a9af512',
        college: '6a5f011b878076f53a9af940',
        role: 'editor',
    },
    {
        name: 'Sunita Rao',
        email: 'sunita.rao.ed@example.com',
        phone: '9876667788',
        course: '6a5efa80878076f53a9af51d',
        college: '6a5f011e878076f53a9af945',
        role: 'editor',
    },
    {
        name: 'Gaurav Sen',
        email: 'gaurav.sen.ed@example.com',
        phone: '9877778899',
        course: '6a5efa7e878076f53a9af509',
        college: '6a5f0117878076f53a9af931',
        role: 'editor',
    },
    {
        name: 'Ayesha Siddiqui',
        email: 'ayesha.s.ed@example.com',
        phone: '9878889900',
        course: '6a5efa80878076f53a9af51d',
        college: '6a5f0118878076f53a9af933',
        role: 'editor',
    },
    {
        name: 'Nitin Kumar',
        email: 'nitin.k.ed@example.com',
        phone: '9879990011',
        course: '6a5efa7e878076f53a9af508',
        college: '6a5f0115878076f53a9af926',
        role: 'editor',
    },
    {
        name: 'Kirti Sharma',
        email: 'kirti.sharma.ed@example.com',
        phone: '9870001122',
        course: '6a5efa81878076f53a9af523',
        college: '6a5f0111878076f53a9af91b',
        role: 'editor',
    },
];

const seedEditors = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        let added = 0;
        let updated = 0;

        for (const user of editors) {
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
            `Successfully added ${added} new editors, updated ${updated} existing editors!`
        );
        process.exit(0);
    } catch (error) {
        console.error('Error seeding editors:', error);
        process.exit(1);
    }
};

seedEditors();
