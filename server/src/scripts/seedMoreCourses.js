import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../features/course/course.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const rawCourses = [
  "B.Tech", "B.E.", "Computer Science Engineering (CSE)", "Information Technology (IT)", 
  "Artificial Intelligence (AI)", "Artificial Intelligence & Machine Learning (AI & ML)", 
  "Data Science", "Cyber Security", "Electronics & Communication Engineering (ECE)", 
  "Electrical Engineering (EE)", "Mechanical Engineering", "Civil Engineering", 
  "Chemical Engineering", "Biotechnology", "Aerospace Engineering", "Automobile Engineering", 
  "Mechatronics", "Robotics", "Industrial Engineering", "Petroleum Engineering", 
  "Environmental Engineering", "Food Technology", "Agricultural Engineering", 
  "Mining Engineering", "Marine Engineering", "Textile Engineering", 
  "BCA", "Cloud Computing", "Mobile Application Development", 
  "B.Sc", "Physics", "Chemistry", "Mathematics", "Statistics", "Computer Science", 
  "Microbiology", "Zoology", "Botany", "Environmental Science", "Forensic Science", "Geology", 
  "B.Com", "Accounting", "Finance", "Banking", "Taxation", "Economics", "International Business", 
  "BBA", "General Management", "Marketing", "Human Resources", "Business Analytics", 
  "Digital Marketing", "Entrepreneurship", 
  "BA", "English", "History", "Political Science", "Sociology", "Psychology", 
  "Journalism", "Public Administration", "Geography", "Philosophy", "Fine Arts", "Music", 
  "B.Des", "UI/UX Design", "Graphic Design", "Product Design", "Fashion Design", 
  "Interior Design", "Animation", "Game Design", 
  "MBBS", "BDS", "BAMS", "BHMS", "BPT", "B.Pharm", "B.Sc Nursing", "BMLT", "BASLP", 
  "LLB", "BA LLB", "BBA LLB", "B.Com LLB", 
  "B.Ed", "B.Sc Agriculture", "B.Tech Agriculture", 
  "BHM", "BTTM", "B.Arch", "B.Sc Aviation", "Commercial Pilot Training", 
  "M.Tech", "VLSI", "Structural Engineering", "Thermal Engineering", "Power Systems", 
  "MCA", "M.Sc", "MBA", "Operations", "Product Management", "Information Systems", 
  "M.Com", "MA", "MD", "MS", "MDS", "M.Pharm", "MPT", "M.Sc Nursing", "LLM", 
  "PhD", "DPhil", "Doctor of Medicine (DM)", "M.Ch", 
  "Electronics", "Management", 
  "Polytechnic Diploma", "Diploma in Computer Science", "Diploma in Mechanical Engineering", 
  "Diploma in Civil Engineering", "Diploma in Electronics", "Diploma in Electrical Engineering", 
  "Diploma in Pharmacy", "Diploma in Hotel Management", "Diploma in Animation", 
  "Diploma in Fashion Design", 
  "Integrated B.Tech + M.Tech", "Integrated BBA + MBA", "Integrated BA LLB", 
  "Integrated BBA LLB", "Integrated B.Com LLB", "Integrated M.Sc",
  "Commerce", "Management", "Designing"
];

const seedCourses = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        // Remove duplicates case-insensitively
        const uniqueCoursesMap = new Map();
        rawCourses.forEach(c => {
            if (c && c.trim()) {
                uniqueCoursesMap.set(c.trim().toLowerCase(), c.trim());
            }
        });

        const uniqueCourses = Array.from(uniqueCoursesMap.values());

        console.log(`Seeding ${uniqueCourses.length} unique courses...`);

        // Upsert courses
        let added = 0;
        for (const courseName of uniqueCourses) {
            const res = await Course.updateOne(
                { name: new RegExp(`^${courseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                { $setOnInsert: { name: courseName } },
                { upsert: true }
            );
            if (res.upsertedCount > 0) added++;
        }

        console.log(`Successfully added ${added} new courses!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

seedCourses();
