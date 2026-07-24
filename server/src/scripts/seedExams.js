import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from '../features/exam/exam.model.js'; // Adjust the import path to your schema file

dotenv.config();

const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_dashboard';

const examsData = [
  {
    name: "Graduate Aptitude Test in Engineering (GATE) 2027",
    requirement: "Bachelor's degree in Engineering, Technology, Architecture, Science, or Commerce (3rd year or higher).",
    regStartingDate: new Date("2026-08-14"),
    regEndingDate: new Date("2026-09-21"),
    examMode: "Online",
    examDescription: `The Graduate Aptitude Test in Engineering (GATE) is a prestigious national-level examination that primarily tests the comprehensive understanding of various undergraduate subjects in engineering and science. It is jointly conducted by the Indian Institute of Science (IISc) and seven Indian Institutes of Technology (IITs) on behalf of the National Coordination Board (NCB)-GATE, Department of Higher Education, Ministry of Education (MoE), Government of India.

GATE scores are utilized for admissions to various post-graduate education programs (Master's and Doctoral) in Indian higher education institutes, with financial assistance provided by MoE and other government agencies. In recent years, several Public Sector Undertakings (PSUs) have also started using GATE scores for their recruitment processes, making it a highly competitive and sought-after examination for engineering graduates seeking stable government careers.

The examination is a Computer Based Test (CBT) consisting of 65 questions for a total of 100 marks. The paper includes General Aptitude and core engineering subjects, evaluating candidates on their technical prowess, analytical skills, and mathematical foundation. A valid GATE score remains applicable for three years from the date of announcement of results, offering candidates flexibility in planning their academic and professional trajectories.`,
    examLink: "https://gate.iitk.ac.in/",
    examDate: new Date("2027-02-06"),
    examDuration: 180,
    examTime: "09:30"
  },
  {
    name: "UPSC Civil Services Examination (CSE) Prelims 2027",
    requirement: "A bachelor's degree from a recognized university. Minimum age 21 years.",
    regStartingDate: new Date("2027-02-01"),
    regEndingDate: new Date("2027-02-21"),
    examMode: "Offline",
    examDescription: `The Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the Union Public Service Commission (UPSC). It serves as the gateway for recruitment to various prestigious Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Foreign Service (IFS), and Indian Police Service (IPS). Widely considered one of the toughest examinations in the world, it demands rigorous preparation, discipline, and a deep understanding of current affairs, history, geography, and governance.

The examination is conducted in three successive phases: the Preliminary Examination (consisting of two objective-type papers), the Main Examination (consisting of nine conventional essay-type papers), and the Personality Test (Interview). The Preliminary phase serves purely as a screening mechanism, and its marks are not counted for determining the final order of merit. However, clearing it is mandatory to appear for the Mains.

Millions of aspirants from diverse academic backgrounds participate in the UPSC CSE every year, vying for a few hundred vacancies. Beyond testing mere academic knowledge, the exam rigorously evaluates a candidate's analytical abilities, ethical standing, and overall suitability for a career in public service. The extensive syllabus encourages aspirants to develop a holistic perspective on national and international issues.`,
    examLink: "https://upsc.gov.in/",
    examDate: new Date("2027-05-30"),
    examDuration: 120, 
    examTime: "09:30"
  },
  {
    name: "Common Admission Test (CAT) 2026",
    requirement: "Bachelor's degree with at least 50% marks or equivalent CGPA (45% for SC/ST/PwD).",
    regStartingDate: new Date("2026-08-02"),
    regEndingDate: new Date("2026-09-15"),
    examMode: "Online",
    examDescription: `The Common Admission Test (CAT) is a highly competitive, computer-based entrance examination conducted in India for admission into graduate management programs. Originally initiated by the Indian Institutes of Management (IIMs) to evaluate candidates for their flagship MBA/PGDM programs, the CAT score is now accepted by over 1,000 top-tier business schools across the country, including IITs, NITs, and prominent private institutions.

The CAT exam strictly tests candidates across three critical domains: Verbal Ability and Reading Comprehension (VARC), Data Interpretation and Logical Reasoning (DILR), and Quantitative Ability (QA). The structure comprises both multiple-choice questions (MCQs) and non-MCQs (Type In The Answer), requiring not just raw mathematical or linguistic knowledge, but exceptional time management, stress-handling capabilities, and strategic prioritization.

Preparing for CAT involves a rigorous schedule of mock tests, syllabus revisions, and analytical reviews to maximize percentile scores. Once candidates clear the percentile cut-offs, they must participate in subsequent rounds such as Written Ability Tests (WAT), Group Discussions (GD), and Personal Interviews (PI) conducted individually by respective institutions before securing a final admission offer.`,
    examLink: "https://iimcat.ac.in/",
    examDate: new Date("2026-11-29"),
    examDuration: 120,
    examTime: "08:30"
  },
  {
    name: "Joint Entrance Examination (JEE) Main 2027",
    requirement: "Passed 10+2 examination with Physics, Mathematics, and Chemistry/Biology/Technical Vocational subject.",
    regStartingDate: new Date("2026-11-01"),
    regEndingDate: new Date("2026-11-30"),
    examMode: "Online",
    examDescription: `The Joint Entrance Examination (JEE) Main is a standardized computer-based test conducted by the National Testing Agency (NTA) in India. It acts as a gateway for undergraduate engineering and architecture admissions in prestigious centrally funded technical institutions such as the National Institutes of Technology (NITs), Indian Institutes of Information Technology (IIITs), and Government Funded Technical Institutes (GFTIs).

JEE Main is divided into different papers depending on the candidate's career trajectory. Paper 1 is designated for B.E./B.Tech courses, while Paper 2A and Paper 2B cater to B.Arch and B.Planning programs, respectively. The syllabus broadly encompasses physics, chemistry, and mathematics from the 11th and 12th-grade curriculum, demanding strong conceptual clarity, rapid problem-solving skills, and a high degree of accuracy.

Beyond securing a seat in an NIT or IIIT, JEE Main holds immense significance as it serves as the qualifying preliminary examination for JEE Advanced—the exclusive entrance test for admission into the elite Indian Institutes of Technology (IITs). Only the top 2.5 lakh rank holders in JEE Main are deemed eligible to write the JEE Advanced, making it fiercely competitive.`,
    examLink: "https://jeemain.nta.nic.in/",
    examDate: new Date("2027-01-24"),
    examDuration: 180,
    examTime: "09:00"
  },
  {
    name: "National Eligibility cum Entrance Test (NEET-UG) 2027",
    requirement: "Passed 10+2 with Physics, Chemistry, Biology/Biotechnology, and English as core subjects.",
    regStartingDate: new Date("2027-02-10"),
    regEndingDate: new Date("2027-03-10"),
    examMode: "Offline",
    examDescription: `The National Eligibility cum Entrance Test (Undergraduate) or NEET-UG is the sole pan-India medical entrance examination for students who wish to pursue undergraduate medical (MBBS), dental (BDS), and AYUSH (BAMS, BUMS, BHMS, etc.) courses. Administered by the National Testing Agency (NTA), NEET has standardized medical admissions across government, private, and deemed universities in India.

Conducted in offline, pen-and-paper mode, the exam demands extreme accuracy and stamina. Candidates are evaluated on their proficiency in Physics, Chemistry, and Biology (Botany and Zoology) over a duration of 3 hours and 20 minutes. The paper strictly aligns with the NCERT curriculum and involves multiple-choice questions (MCQs) that carry negative marking, necessitating both deep subject knowledge and meticulous risk calculation.

Securing a high rank in NEET-UG is immensely challenging given the sheer volume of applicants, which often exceeds 2 million annually. Admissions are allocated through centralized counseling by the Medical Counselling Committee (MCC) for the 15% All India Quota, and by respective state authorities for the remaining 85% state quota seats.`,
    examLink: "https://neet.nta.nic.in/",
    examDate: new Date("2027-05-02"),
    examDuration: 200, 
    examTime: "14:00"
  },
  {
    name: "Graduate Record Examinations (GRE) General Test",
    requirement: "Bachelor's degree or equivalent. Valid passport required for international testing.",
    regStartingDate: new Date("2026-01-01"),
    regEndingDate: new Date("2026-12-31"),
    examMode: "Online",
    examDescription: `The Graduate Record Examinations (GRE) General Test is an internationally recognized standardized exam utilized by graduate and business schools worldwide for admissions into master's, doctoral, and specialized degree programs. Managed and administered by the Educational Testing Service (ETS), the GRE aims to measure verbal reasoning, quantitative reasoning, analytical writing, and critical thinking skills that are not strictly bound to a specific field of study.

Recently revamped for a shorter, more efficient testing experience, the GRE now clocks in at just under two hours. The computer-adaptive nature of the exam means that a test-taker's performance in the initial sections of verbal or quantitative reasoning dictates the difficulty level of subsequent sections. This advanced testing model ensures a highly precise measurement of cognitive abilities and problem-solving aptitudes.

A significant advantage of the GRE is its flexibility; candidates can take the exam almost any day of the year at certified test centers or from home. GRE scores remain valid for up to five years, allowing students to plan their higher education strategies well in advance. Many prestigious law schools and MBA programs now accept GRE scores as a robust alternative to standard business school exams.`,
    examLink: "https://www.ets.org/gre",
    examDate: new Date("2026-10-15"),
    examDuration: 118,
    examTime: "10:00"
  },
  {
    name: "AWS Certified Solutions Architect - Associate",
    requirement: "No prerequisites, though 1 year of hands-on experience designing systems on AWS is recommended.",
    regStartingDate: new Date("2026-01-01"),
    regEndingDate: new Date("2026-12-31"),
    examMode: "Online",
    examDescription: `The AWS Certified Solutions Architect - Associate (SAA-C03) is an industry-leading cloud certification offered by Amazon Web Services. It is specifically targeted at individuals who perform a solutions architect role and wish to validate their technical expertise in designing and deploying scalable, highly available, and fault-tolerant systems on the AWS platform. This credential serves as a gold standard in the IT industry for cloud architecture.

The certification exam rigorously evaluates a professional’s ability to design secure architectures, construct resilient architectures, establish high-performing networks, and architect cost-optimized systems. Topics cover a vast array of core AWS services, including compute (EC2), storage (S3), networking (VPC), databases (RDS/DynamoDB), and identity/access management (IAM), requiring candidates to demonstrate practical, scenario-based problem-solving skills.

Obtaining this certification often results in significant career advancement, higher salary brackets, and increased credibility among peers and employers. Due to the rapid evolution of cloud technologies, AWS requires certified individuals to recertify every three years, ensuring that architects remain up-to-date with the latest architectural best practices and newly released services.`,
    examLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    examDate: new Date("2026-08-20"),
    examDuration: 130,
    examTime: "10:00"
  },
  {
    name: "Project Management Professional (PMP)",
    requirement: "Four-year degree, 36 months of leading projects, and 35 hours of project management education/training.",
    regStartingDate: new Date("2026-01-01"),
    regEndingDate: new Date("2026-12-31"),
    examMode: "Online",
    examDescription: `The Project Management Professional (PMP) certification, issued by the Project Management Institute (PMI), is the most esteemed and globally recognized credential for project management professionals. It acts as an objective endorsement of a project manager's ability to successfully lead and direct complex projects, demonstrating their profound understanding of established project management frameworks, methodologies, and best practices.

The modern PMP exam framework focuses intensely on three core domains: People (emphasizing soft skills to effectively lead project teams in today's changing environment), Process (reinforcing the technical aspects of managing projects), and Business Environment (highlighting the connection between projects and organizational strategy). Furthermore, the curriculum is heavily integrated with Agile, Predictive, and Hybrid methodologies, reflecting modern workplace realities.

Earning a PMP certification requires rigorous preparation, but the dividends are substantial, often leading to immediate salary bumps and elevated career trajectories across IT, construction, finance, and healthcare industries. To maintain the credential, professionals must actively earn 60 Professional Development Units (PDUs) every three years, ensuring continuous learning and engagement with the project management community.`,
    examLink: "https://www.pmi.org/certifications/project-management-pmp",
    examDate: new Date("2026-09-10"),
    examDuration: 230,
    examTime: "08:00"
  },
  {
    name: "Test of English as a Foreign Language (TOEFL iBT)",
    requirement: "Valid passport or national ID. Intended for non-native English speakers.",
    regStartingDate: new Date("2026-01-01"),
    regEndingDate: new Date("2026-12-31"),
    examMode: "Online",
    examDescription: `The Test of English as a Foreign Language (TOEFL iBT) is a prominent English-language proficiency test accepted by more than 11,500 universities and other institutions in over 160 countries. Administered by the Educational Testing Service (ETS), it assesses the ability of non-native speakers to understand and use English accurately as it is spoken, written, and heard in academic settings.

The TOEFL iBT comprehensively evaluates four primary language skills: Reading, Listening, Speaking, and Writing. The examination uniquely integrates these skills—for instance, requiring a test-taker to read a passage, listen to a related lecture, and then speak or write a synthesized response. This holistic evaluation accurately mirrors the communicative challenges international students face in real university environments.

With recent updates, the TOEFL iBT has been streamlined to take just under two hours, making it less physically taxing while maintaining its rigorous standards. The scores are highly regarded for higher education admissions, scholarship applications, and even for securing professional licenses or satisfying visa requirements in English-speaking nations.`,
    examLink: "https://www.ets.org/toefl",
    examDate: new Date("2026-07-15"),
    examDuration: 116,
    examTime: "11:00"
  },
  {
    name: "Cisco Certified Network Associate (CCNA) 200-301",
    requirement: "No formal prerequisites, but 1+ years of experience implementing and administering Cisco solutions is recommended.",
    regStartingDate: new Date("2026-01-01"),
    regEndingDate: new Date("2026-12-31"),
    examMode: "Online",
    examDescription: `The Cisco Certified Network Associate (CCNA) is a foundational IT certification issued by Cisco Systems that validates an individual's ability to navigate the ever-evolving landscape of modern IT networking. As a highly respected entry-level certification, it serves as the ultimate launching pad for a successful career in network administration, network engineering, and cybersecurity infrastructure support.

The CCNA 200-301 exam covers a comprehensive breadth of networking topics. Candidates are tested on Network Fundamentals, Network Access, IP Connectivity (including IPv4 and IPv6 routing), IP Services, Security Fundamentals, and Automation and Programmability. The inclusion of network automation and software-defined networking concepts ensures that CCNA holders are equipped with the skills required to handle next-generation programmable networks.

By successfully passing the CCNA exam, professionals demonstrate their capability to install, configure, troubleshoot, and operate medium-sized routed and switched networks. This credential not only boosts employability and earning potential but also lays the necessary groundwork for pursuing more advanced Cisco certifications like the CCNP and CCIE in specialized domains.`,
    examLink: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
    examDate: new Date("2026-10-05"),
    examDuration: 120,
    examTime: "10:00"
  }
];

// Asynchronous function to seed the database
const seedDB = async () => {
  try {
    // Ensure you connect to your database first
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // Clear existing exams to prevent unique index conflicts
    await Exam.deleteMany({});
    console.log('Cleared existing exams.');

    // Bulk insert the data
    const insertedExams = await Exam.insertMany(examsData);
    console.log(`Successfully seeded ${insertedExams.length} exams.`);

    // Gracefully exit
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seedDB();
