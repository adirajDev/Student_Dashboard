import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../features/course/program.model.js';

dotenv.config();

const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const courses = [
    {
        name: 'Diploma in Computer Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Mechanical Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Civil Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Electrical Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Electronics and Communication Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Pharmacy (D.Pharm)',
        level: 'diploma',
    },
    {
        name: 'Diploma in Medical Laboratory Technology (DMLT)',
        level: 'diploma',
    },
    {
        name: 'Diploma in Architecture',
        level: 'diploma',
    },
    {
        name: 'Diploma in Hotel Management and Catering Technology',
        level: 'diploma',
    },
    {
        name: 'Diploma in Chemical Engineering',
        level: 'diploma',
    },
    {
        name: 'Diploma in Interior Design',
        level: 'diploma',
    },
    {
        name: 'Diploma in Graphic Designing',
        level: 'diploma',
    },
    {
        name: 'Diploma in Agriculture',
        level: 'diploma',
    },
    {
        name: 'Diploma in Animation and Multimedia',
        level: 'diploma',
    },
    {
        name: 'Diploma in Elementary Education (D.El.Ed)',
        level: 'diploma',
    },
    {
        name: 'Diploma in Automobile Engineering',
        level: 'diploma',
    },
    {
        name: 'Bachelor of Technology in Computer Science and Engineering',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Technology in Information Technology',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Technology in Electronics and Communication Engineering',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Technology in Mechanical Engineering',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Technology in Civil Engineering',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Dental Surgery (BDS)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Science in Nursing',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Computer Applications (BCA)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Business Administration (BBA)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Commerce in Accounting and Finance',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Arts in Economics',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Science in Biotechnology',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Architecture (B.Arch)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Pharmacy (B.Pharm)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Law (LL.B)',
        level: 'bachelors',
    },
    {
        name: 'Bachelor of Design in Fashion Design',
        level: 'bachelors',
    },
    {
        name: 'Master of Technology in Computer Science and Engineering',
        level: 'masters',
    },
    {
        name: 'Master of Technology in VLSI Design',
        level: 'masters',
    },
    {
        name: 'Master of Technology in Structural Engineering',
        level: 'masters',
    },
    {
        name: 'Master of Business Administration (MBA)',
        level: 'masters',
    },
    {
        name: 'Master of Computer Applications (MCA)',
        level: 'masters',
    },
    {
        name: 'Master of Science in Physics',
        level: 'masters',
    },
    {
        name: 'Master of Science in Organic Chemistry',
        level: 'masters',
    },
    {
        name: 'Master of Science in Information Technology',
        level: 'masters',
    },
    {
        name: 'Master of Science in Data Science',
        level: 'masters',
    },
    {
        name: 'Master of Arts in English Literature',
        level: 'masters',
    },
    {
        name: 'Master of Arts in Clinical Psychology',
        level: 'masters',
    },
    {
        name: 'Master of Commerce in Finance',
        level: 'masters',
    },
    {
        name: 'Master of Pharmacy (M.Pharm)',
        level: 'masters',
    },
    {
        name: 'Master of Laws (LL.M)',
        level: 'masters',
    },
    {
        name: 'Master of Public Health (MPH)',
        level: 'masters',
    },
    {
        name: 'Master of Social Work (MSW)',
        level: 'masters',
    },
    {
        name: 'Master of Design in Industrial Design',
        level: 'masters',
    },
];

const seedCourses = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        let added = 0;
        let updated = 0;

        for (const course of courses) {
            const res = await Course.updateOne(
                { name: course.name },
                { $set: course },
                { upsert: true }
            );

            if (res.upsertedCount > 0) {
                added++;
            } else if (res.modifiedCount > 0) {
                updated++;
            }
        }

        console.log(
            `Successfully added ${added} new courses, updated ${updated} existing courses!`
        );
        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

seedCourses();
