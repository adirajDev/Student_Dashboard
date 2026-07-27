import mongoose from 'mongoose';
import Course from '../../src/features/course/course.model.js'; // Adjust this path to your actual model location
import dotenv from 'dotenv';
dotenv.config();
import { courses } from "./course.js";

const seedCourses = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database');

    await Course.syncIndexes();
    console.log('Indexes synced');

    // 2. Map the array into Mongoose bulkWrite operations
    const bulkOps = courses.map((course) => ({
      updateOne: {
        filter: {
          shortName: course.shortName,
          specialization: course.specialization
        },
        update: { $set: course },
        upsert: true // Insert if it doesn't exist, update if it does
      }
    }));

    // 3. Execute all database operations in a single network trip
    const result = await Course.bulkWrite(bulkOps);

    console.log(
        `Successfully added ${result.upsertedCount} new courses, ` +
        `updated ${result.modifiedCount} existing courses!`
    );

  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  } finally {
    // 4. Gracefully close the connection to exit the Node process naturally
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Database connection closed.');
    }
  }
};

seedCourses();