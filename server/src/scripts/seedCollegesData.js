import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../features/college/college.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const colleges = [
  {
    "name": "Indian Institute of Technology Bombay",
    "location": "Mumbai, Maharashtra",
    "collegeId": "IITB",
    "description": "Premier engineering and research institute.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa7e878076f53a9af50b",
      "6a5efa80878076f53a9af51a"
    ]
  },
  {
    "name": "Indian Institute of Technology Delhi",
    "location": "New Delhi, Delhi",
    "collegeId": "IITD",
    "description": "Top-tier technical institute in the capital.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50c",
      "6a5efa80878076f53a9af51a"
    ]
  },
  {
    "name": "Indian Institute of Technology Madras",
    "location": "Chennai, Tamil Nadu",
    "collegeId": "IITM",
    "description": "Leading institute for engineering and technology.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa81878076f53a9af523"
    ]
  },
  {
    "name": "Indian Institute of Technology Kanpur",
    "location": "Kanpur, Uttar Pradesh",
    "collegeId": "IITK",
    "description": "Known for intense academic rigor and research.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50b",
      "6a5efa81878076f53a9af520"
    ]
  },
  {
    "name": "Indian Institute of Technology Kharagpur",
    "location": "Kharagpur, West Bengal",
    "collegeId": "IITKGP",
    "description": "The first IIT established in India.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa80878076f53a9af516",
      "6a5efa80878076f53a9af518"
    ]
  },
  {
    "name": "Indian Institute of Technology Roorkee",
    "location": "Roorkee, Uttarakhand",
    "collegeId": "IITR",
    "description": "Oldest technical institution in Asia.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50c",
      "6a5efa80878076f53a9af516"
    ]
  },
  {
    "name": "Indian Institute of Technology Guwahati",
    "location": "Guwahati, Assam",
    "collegeId": "IITG",
    "description": "Prominent engineering institute in the North East.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa82878076f53a9af52d"
    ]
  },
  {
    "name": "Indian Institute of Technology Hyderabad",
    "location": "Sangareddy, Telangana",
    "collegeId": "IITH",
    "description": "Fast-growing second-generation IIT.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa80878076f53a9af51b",
      "6a5efa81878076f53a9af523"
    ]
  },
  {
    "name": "Indian Institute of Technology Indore",
    "location": "Indore, Madhya Pradesh",
    "collegeId": "IITI",
    "description": "Known for high impact research outputs.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50b"
    ]
  },
  {
    "name": "Indian Institute of Technology Varanasi (BHU)",
    "location": "Varanasi, Uttar Pradesh",
    "collegeId": "IITBHU",
    "description": "Historic engineering institute merged with IIT system.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa7e878076f53a9af517"
    ]
  },
  {
    "name": "Indian Institute of Technology Dhanbad (ISM)",
    "location": "Dhanbad, Jharkhand",
    "collegeId": "IITISM",
    "description": "Premier institute famous for mining and core engineering.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af509"
    ]
  },
  {
    "name": "Indian Institute of Technology Bhubaneswar",
    "location": "Bhubaneswar, Odisha",
    "collegeId": "IITBBS",
    "description": "Second generation IIT with a strong core focus.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50c"
    ]
  },
  {
    "name": "Indian Institute of Technology Gandhinagar",
    "location": "Gandhinagar, Gujarat",
    "collegeId": "IITGN",
    "description": "Innovative curriculum and strong interdisciplinary approach.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50b"
    ]
  },
  {
    "name": "Indian Institute of Technology Ropar",
    "location": "Rupnagar, Punjab",
    "collegeId": "IITRPR",
    "description": "Top ranking among newer IITs.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a"
    ]
  },
  {
    "name": "Indian Institute of Technology Patna",
    "location": "Patna, Bihar",
    "collegeId": "IITP",
    "description": "Leading technical education in Bihar.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af509"
    ]
  },
  {
    "name": "National Institute of Technology Tiruchirappalli",
    "location": "Tiruchirappalli, Tamil Nadu",
    "collegeId": "NITT",
    "description": "Top ranked NIT in the country.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa80878076f53a9af516"
    ]
  },
  {
    "name": "National Institute of Technology Surathkal",
    "location": "Mangaluru, Karnataka",
    "collegeId": "NITK",
    "description": "Premier NIT known for excellent placements.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af509",
      "6a5efa80878076f53a9af51a"
    ]
  },
  {
    "name": "National Institute of Technology Rourkela",
    "location": "Rourkela, Odisha",
    "collegeId": "NITR",
    "description": "Known for wide range of engineering branches.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50c",
      "6a5efa80878076f53a9af516"
    ]
  },
  {
    "name": "National Institute of Technology Warangal",
    "location": "Warangal, Telangana",
    "collegeId": "NITW",
    "description": "First NIT established in India.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa81878076f53a9af51e"
    ]
  },
  {
    "name": "Indian Institute of Information Technology Hyderabad",
    "location": "Hyderabad, Telangana",
    "collegeId": "IIITH",
    "description": "Top tier institute for CS and research.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa80878076f53a9af51a"
    ]
  },
  {
    "name": "Indian Institute of Information Technology Allahabad",
    "location": "Prayagraj, Uttar Pradesh",
    "collegeId": "IIITA",
    "description": "Premier institute known for IT and coding culture.",
    "availableCourses": [
      "6a5efa7e878076f53a9af509",
      "6a5efa7e878076f53a9af50a",
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "Indian Institute of Management Ahmedabad",
    "location": "Ahmedabad, Gujarat",
    "collegeId": "IIMA",
    "description": "The premier business school in India.",
    "availableCourses": [
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "Indian Institute of Management Bangalore",
    "location": "Bengaluru, Karnataka",
    "collegeId": "IIMB",
    "description": "Top B-School known for strategy and consulting.",
    "availableCourses": [
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "Indian Institute of Management Calcutta",
    "location": "Kolkata, West Bengal",
    "collegeId": "IIMC",
    "description": "Pioneer in finance and quantitative courses.",
    "availableCourses": [
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "All India Institute of Medical Sciences (AIIMS) New Delhi",
    "location": "New Delhi, Delhi",
    "collegeId": "AIIMSD",
    "description": "Apex medical research and educational institute.",
    "availableCourses": [
      "6a5efa7e878076f53a9af50d",
      "6a5efa7f878076f53a9af510",
      "6a5efa82878076f53a9af52a"
    ]
  },
  {
    "name": "Christian Medical College (CMC)",
    "location": "Vellore, Tamil Nadu",
    "collegeId": "CMCV",
    "description": "One of the most prestigious medical colleges.",
    "availableCourses": [
      "6a5efa7e878076f53a9af50d",
      "6a5efa7f878076f53a9af510",
      "6a5efa7c878076f53a9af4fe"
    ]
  },
  {
    "name": "National Law School of India University (NLSIU)",
    "location": "Bengaluru, Karnataka",
    "collegeId": "NLSIU",
    "description": "The top-ranked law school in India.",
    "availableCourses": [
      "6a5efa80878076f53a9af518",
      "6a5efa82878076f53a9af529"
    ]
  },
  {
    "name": "NALSAR University of Law",
    "location": "Hyderabad, Telangana",
    "collegeId": "NALSAR",
    "description": "Renowned for corporate law and mooting.",
    "availableCourses": [
      "6a5efa80878076f53a9af518",
      "6a5efa82878076f53a9af529",
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "National Institute of Design (NID) Ahmedabad",
    "location": "Ahmedabad, Gujarat",
    "collegeId": "NIDA",
    "description": "India's premier design institute.",
    "availableCourses": [
      "6a5efa80878076f53a9af519",
      "6a5efa82878076f53a9af52d"
    ]
  },
  {
    "name": "School of Planning and Architecture (SPA) Delhi",
    "location": "New Delhi, Delhi",
    "collegeId": "SPAD",
    "description": "Premier architecture and planning institute.",
    "availableCourses": [
      "6a5efa80878076f53a9af516"
    ]
  },
  {
    "name": "BITS Pilani",
    "location": "Pilani, Rajasthan",
    "collegeId": "BITSP",
    "description": "Top private engineering institute in India.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa7e878076f53a9af50b",
      "6a5efa80878076f53a9af517"
    ]
  },
  {
    "name": "Vellore Institute of Technology (VIT)",
    "location": "Vellore, Tamil Nadu",
    "collegeId": "VITV",
    "description": "Massive infrastructure and huge placement records.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa7f878076f53a9af511",
      "6a5efa81878076f53a9af51e",
      "6a5efa7f878076f53a9af512"
    ]
  },
  {
    "name": "Lovely Professional University (LPU)",
    "location": "Phagwara, Punjab",
    "collegeId": "LPU",
    "description": "Massive private university known for diverse courses, tech ecosystem, and massive campus.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7f878076f53a9af511",
      "6a5efa81878076f53a9af51e",
      "6a5efa7f878076f53a9af512",
      "6a5efa80878076f53a9af51d",
      "6a5efa80878076f53a9af517",
      "6a5efa80878076f53a9af518",
      "6a5efa7f878076f53a9af513"
    ]
  },
  {
    "name": "Symbiosis International University",
    "location": "Pune, Maharashtra",
    "collegeId": "SIU",
    "description": "Top private university famous for management and law.",
    "availableCourses": [
      "6a5efa7f878076f53a9af512",
      "6a5efa80878076f53a9af51d",
      "6a5efa80878076f53a9af518",
      "6a5efa7e878076f53a9af508",
      "6a5efa7f878076f53a9af511"
    ]
  },
  {
    "name": "Christ University",
    "location": "Bengaluru, Karnataka",
    "collegeId": "CHRIST",
    "description": "Highly reputed for arts, commerce, and management.",
    "availableCourses": [
      "6a5efa7f878076f53a9af513",
      "6a5efa7f878076f53a9af512",
      "6a5efa80878076f53a9af51d",
      "6a5efa81878076f53a9af524",
      "6a5efa7f878076f53a9af511"
    ]
  },
  {
    "name": "Shri Ram College of Commerce (SRCC)",
    "location": "New Delhi, Delhi",
    "collegeId": "SRCC",
    "description": "The most prestigious commerce college in India.",
    "availableCourses": [
      "6a5efa7f878076f53a9af513",
      "6a5efa7f878076f53a9af514"
    ]
  },
  {
    "name": "St. Stephen's College",
    "location": "New Delhi, Delhi",
    "collegeId": "SSC",
    "description": "Historic and elite arts and sciences college.",
    "availableCourses": [
      "6a5efa7f878076f53a9af514",
      "6a5efa81878076f53a9af520",
      "6a5efa81878076f53a9af524"
    ]
  },
  {
    "name": "Jadavpur University",
    "location": "Kolkata, West Bengal",
    "collegeId": "JU",
    "description": "State university with phenomenal engineering and arts faculties.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50b",
      "6a5efa7f878076f53a9af514",
      "6a5efa81878076f53a9af524"
    ]
  },
  {
    "name": "Delhi Technological University (DTU)",
    "location": "New Delhi, Delhi",
    "collegeId": "DTU",
    "description": "Top-tier state engineering university (formerly DCE).",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50a",
      "6a5efa7e878076f53a9af50b",
      "6a5efa80878076f53a9af51d"
    ]
  },
  {
    "name": "College of Engineering, Pune (COEP)",
    "location": "Pune, Maharashtra",
    "collegeId": "COEP",
    "description": "Third oldest engineering college in Asia.",
    "availableCourses": [
      "6a5efa7e878076f53a9af508",
      "6a5efa7e878076f53a9af50b",
      "6a5efa7e878076f53a9af50c",
      "6a5efa80878076f53a9af51a"
    ]
  }
];

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

        console.log(`Successfully added ${added} new colleges, updated ${updated} existing colleges!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding colleges:', error);
        process.exit(1);
    }
};

seedColleges();
