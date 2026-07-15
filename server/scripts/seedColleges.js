import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../models/College.js';
import Course from '../models/Course.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const collegesData = [
  {
    name: 'Indian Institute of Technology (IIT) Bombay',
    location: 'Mumbai, Maharashtra',
    collegeID: 'IITB001',
    description: 'A premier engineering and research institution in India.'
  },
  {
    name: 'Indian Institute of Technology (IIT) Delhi',
    location: 'New Delhi, Delhi',
    collegeID: 'IITD002',
    description: 'One of the leading public technical and research universities.'
  },
  {
    name: 'National Institute of Technology (NIT) Trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    collegeID: 'NITT003',
    description: 'An Institute of National Importance known for engineering excellence.'
  },
  {
    name: 'Birla Institute of Technology and Science (BITS) Pilani',
    location: 'Pilani, Rajasthan',
    collegeID: 'BITS004',
    description: 'A highly reputed private institute for higher education and research in engineering.'
  },
  {
    name: 'All India Institute of Medical Sciences (AIIMS) New Delhi',
    location: 'New Delhi, Delhi',
    collegeID: 'AIIMS005',
    description: 'A group of autonomous public medical colleges of higher education.'
  },
  {
    name: 'National Law University (NLU) Delhi',
    location: 'New Delhi, Delhi',
    collegeID: 'NLUD006',
    description: 'One of the elite national law schools in India.'
  },
  {
    name: 'Indian Institute of Management (IIM) Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    collegeID: 'IIMA007',
    description: 'A premier public business school in India.'
  },
  {
    name: 'Delhi University (DU)',
    location: 'New Delhi, Delhi',
    collegeID: 'DU008',
    description: 'A collegiate public central university known for science, arts, and commerce programs.'
  },
  {
    name: 'Vellore Institute of Technology (VIT)',
    location: 'Vellore, Tamil Nadu',
    collegeID: 'VIT009',
    description: 'A popular private deemed university.'
  },
  {
    name: 'SRM Institute of Science and Technology',
    location: 'Chennai, Tamil Nadu',
    collegeID: 'SRM010',
    description: 'A top private engineering and medical university.'
  },
  {
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Cambridge, MA, USA',
    collegeID: 'MIT011',
    description: 'World-renowned for scientific and technological training and research.'
  },
  {
    name: 'Stanford University',
    location: 'Stanford, CA, USA',
    collegeID: 'STAN012',
    description: 'A prestigious private research university in California.'
  }
];

// Helper to get N random elements from an array
const getRandomSubset = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

const seedColleges = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        // Fetch all available courses
        const courses = await Course.find({});
        if (courses.length === 0) {
            console.error('No courses found in the database. Please seed courses first.');
            process.exit(1);
        }
        
        console.log(`Found ${courses.length} courses in DB.`);

        let added = 0;
        let updated = 0;

        for (const colData of collegesData) {
            // Assign 10 to 25 random courses to each college
            const numCourses = Math.floor(Math.random() * 16) + 10;
            const randomCourses = getRandomSubset(courses, numCourses);
            const courseIds = randomCourses.map(c => c._id);

            const res = await College.updateOne(
                { name: colData.name },
                { 
                    $set: { 
                        ...colData,
                        availableCourses: courseIds
                    }
                },
                { upsert: true }
            );

            if (res.upsertedCount > 0) {
                added++;
            } else if (res.modifiedCount > 0) {
                updated++;
            }
        }

        console.log(`Successfully added ${added} new colleges, updated ${updated} existing colleges with courses!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding colleges:', error);
        process.exit(1);
    }
};

seedColleges();
