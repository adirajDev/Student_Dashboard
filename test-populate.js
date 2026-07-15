import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
import Course from './server/models/Course.js';
import College from './server/models/College.js';

dotenv.config({ path: './server/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ role: 'student' }).populate('course college');
  console.log(JSON.stringify(user, null, 2));
  process.exit(0);
}
run();
