import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';
import Course from './models/Course.js';
import Hostel from './models/Hostel.js';

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

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Course.deleteMany({});
    await Hostel.deleteMany({});

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@uniportal.edu',
      password: hashedPassword,
      fullName: 'System Administrator',
      phone: '+1234567890',
      role: 'admin'
    });

    console.log('Creating departments...');
    const departments = await Department.insertMany([
      { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Engineering' },
      { name: 'Electronics', code: 'EC', description: 'Department of Electronics and Communication' },
      { name: 'Mechanical', code: 'ME', description: 'Department of Mechanical Engineering' },
      { name: 'Business Administration', code: 'MBA', description: 'Department of Business Administration' }
    ]);

    console.log('Creating courses...');
    await Course.insertMany([
      {
        name: 'Bachelor of Technology in Computer Science',
        code: 'BTCS',
        departmentId: departments[0]._id,
        programType: 'UG',
        duration: 4,
        totalSeats: 60,
        availableSeats: 60,
        eligibilityPercentage: 75,
        feesPerSemester: 50000,
        description: 'Comprehensive program in computer science and software engineering'
      },
      {
        name: 'Bachelor of Technology in Electronics',
        code: 'BTEC',
        departmentId: departments[1]._id,
        programType: 'UG',
        duration: 4,
        totalSeats: 50,
        availableSeats: 50,
        eligibilityPercentage: 70,
        feesPerSemester: 45000,
        description: 'Electronics and communication engineering program'
      },
      {
        name: 'Bachelor of Technology in Mechanical',
        code: 'BTME',
        departmentId: departments[2]._id,
        programType: 'UG',
        duration: 4,
        totalSeats: 40,
        availableSeats: 40,
        eligibilityPercentage: 70,
        feesPerSemester: 45000,
        description: 'Mechanical engineering program'
      },
      {
        name: 'Master of Computer Applications',
        code: 'MCA',
        departmentId: departments[0]._id,
        programType: 'PG',
        duration: 2,
        totalSeats: 30,
        availableSeats: 30,
        eligibilityPercentage: 60,
        feesPerSemester: 60000,
        description: 'Advanced program in computer applications'
      },
      {
        name: 'Master of Business Administration',
        code: 'MBA',
        departmentId: departments[3]._id,
        programType: 'PG',
        duration: 2,
        totalSeats: 40,
        availableSeats: 40,
        eligibilityPercentage: 55,
        feesPerSemester: 70000,
        description: 'Professional business management program'
      }
    ]);

    console.log('Creating hostels...');
    await Hostel.insertMany([
      {
        name: 'Boys Hostel A',
        code: 'BHA',
        gender: 'male',
        totalRooms: 50,
        availableRooms: 50,
        capacityPerRoom: 2,
        feePerSemester: 15000,
        amenities: ['WiFi', 'Mess', 'Gym', 'Common Room'],
        address: 'Campus Block A'
      },
      {
        name: 'Girls Hostel A',
        code: 'GHA',
        gender: 'female',
        totalRooms: 40,
        availableRooms: 40,
        capacityPerRoom: 2,
        feePerSemester: 15000,
        amenities: ['WiFi', 'Mess', 'Gym', 'Common Room'],
        address: 'Campus Block B'
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@uniportal.edu');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
