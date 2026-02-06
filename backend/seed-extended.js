import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Subject from './models/Subject.js';
import Exam from './models/Exam.js';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/';
    const dbName = process.env.DB_NAME || 'university_db';
    const connectionString = mongoUrl.endsWith('/') ? `${mongoUrl}${dbName}` : `${mongoUrl}/${dbName}`;
    await mongoose.connect(connectionString);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedExtendedData = async () => {
  try {
    await connectDB();

    console.log('Fetching courses...');
    const courses = await Course.find();

    console.log('Creating subjects for each course...');
    await Subject.deleteMany({});
    
    for (const course of courses) {
      const subjectsForCourse = [
        {
          name: `${course.name} - Fundamentals`,
          code: `${course.code}101`,
          courseId: course._id,
          semester: 1,
          credits: 4,
          description: 'Introduction to fundamental concepts',
          isElective: false
        },
        {
          name: `${course.name} - Advanced Topics`,
          code: `${course.code}201`,
          courseId: course._id,
          semester: 2,
          credits: 4,
          description: 'Advanced concepts and applications',
          isElective: false
        },
        {
          name: `${course.name} - Practical Lab`,
          code: `${course.code}LAB`,
          courseId: course._id,
          semester: 1,
          credits: 2,
          description: 'Hands-on practical sessions',
          isElective: false
        }
      ];
      
      await Subject.insertMany(subjectsForCourse);
      console.log(`Created ${subjectsForCourse.length} subjects for ${course.name}`);
    }

    console.log('Creating exams...');
    await Exam.deleteMany({});
    
    for (const course of courses) {
      const exams = [
        {
          name: 'Mid-Term Examination',
          courseId: course._id,
          semester: 1,
          examType: 'mid-term',
          examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxMarks: 50,
          passingMarks: 20,
          status: 'scheduled'
        },
        {
          name: 'End-Term Examination',
          courseId: course._id,
          semester: 1,
          examType: 'end-term',
          examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          maxMarks: 100,
          passingMarks: 40,
          status: 'scheduled'
        }
      ];
      
      await Exam.insertMany(exams);
      console.log(`Created ${exams.length} exams for ${course.name}`);
    }

    console.log('Extended data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedExtendedData();
