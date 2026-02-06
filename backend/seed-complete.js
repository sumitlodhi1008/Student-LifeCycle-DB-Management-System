import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Faculty from './models/Faculty.js';
import Course from './models/Course.js';
import Subject from './models/Subject.js';
import Enrollment from './models/Enrollment.js';
import Department from './models/Department.js';
import Application from './models/Application.js';
import Hostel from './models/Hostel.js';
import HostelAllocation from './models/HostelAllocation.js';
import Fee from './models/Fee.js';
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

const seedCompleteData = async () => {
  try {
    await connectDB();
    console.log('Starting complete data seed...\n');

    // Get existing data
    const courses = await Course.find();
    const departments = await Department.find();
    const subjects = await Subject.find();

    if (courses.length === 0 || departments.length === 0) {
      console.log('Please run the initial seed first (node seed.js)');
      process.exit(1);
    }

    console.log(`Found ${courses.length} courses, ${departments.length} departments, ${subjects.length} subjects`);

    // Create faculty users and profiles
    console.log('\n=== Creating Faculty ===');
    const facultyData = [
      { 
        fullName: 'Dr. Rajesh Kumar', 
        email: 'rajesh.kumar@uniportal.edu', 
        phone: '9876543210',
        employeeId: 'FAC001',
        designation: 'Professor',
        qualification: 'Ph.D. Computer Science',
        specialization: 'Machine Learning',
        experience: 15
      },
      { 
        fullName: 'Dr. Priya Sharma', 
        email: 'priya.sharma@uniportal.edu', 
        phone: '9876543211',
        employeeId: 'FAC002',
        designation: 'Associate Professor',
        qualification: 'Ph.D. Electronics',
        specialization: 'VLSI Design',
        experience: 10
      },
      { 
        fullName: 'Prof. Amit Singh', 
        email: 'amit.singh@uniportal.edu', 
        phone: '9876543212',
        employeeId: 'FAC003',
        designation: 'Assistant Professor',
        qualification: 'M.Tech, Ph.D. (pursuing)',
        specialization: 'Data Science',
        experience: 5
      }
    ];

    const createdFaculty = [];
    for (const fData of facultyData) {
      // Check if faculty user already exists
      let facultyUser = await User.findOne({ email: fData.email });
      
      if (!facultyUser) {
        const hashedPassword = await bcrypt.hash('faculty123', 10);
        facultyUser = new User({
          email: fData.email,
          password: hashedPassword,
          fullName: fData.fullName,
          phone: fData.phone,
          role: 'faculty'
        });
        await facultyUser.save();
        console.log(`Created faculty user: ${fData.fullName}`);
      }

      // Check if faculty profile exists
      let faculty = await Faculty.findOne({ userId: facultyUser._id });
      
      if (!faculty) {
        faculty = new Faculty({
          userId: facultyUser._id,
          employeeId: fData.employeeId,
          departmentId: departments[0]._id,
          designation: fData.designation,
          qualification: fData.qualification,
          specialization: fData.specialization,
          experience: fData.experience,
          assignedSubjects: [],
          joiningDate: new Date()
        });
        await faculty.save();
        console.log(`Created faculty profile: ${fData.fullName}`);
      }
      
      createdFaculty.push(faculty);
    }

    // Assign subjects to faculty
    console.log('\n=== Assigning Subjects to Faculty ===');
    const subjectsPerFaculty = Math.ceil(subjects.length / createdFaculty.length);
    
    for (let i = 0; i < createdFaculty.length; i++) {
      const startIdx = i * subjectsPerFaculty;
      const endIdx = Math.min(startIdx + subjectsPerFaculty, subjects.length);
      const assignedSubjects = subjects.slice(startIdx, endIdx).map(s => s._id);
      
      await Faculty.findByIdAndUpdate(createdFaculty[i]._id, {
        assignedSubjects: assignedSubjects
      });
      console.log(`Assigned ${assignedSubjects.length} subjects to ${facultyData[i].fullName}`);
    }

    // Create student users with applications and enrollments
    console.log('\n=== Creating Students ===');
    const studentData = [
      { fullName: 'Rahul Verma', email: 'rahul.verma@student.edu', phone: '9988776655', gender: 'male', percentage: 85 },
      { fullName: 'Sneha Patel', email: 'sneha.patel@student.edu', phone: '9988776656', gender: 'female', percentage: 92 },
      { fullName: 'Vikram Joshi', email: 'vikram.joshi@student.edu', phone: '9988776657', gender: 'male', percentage: 78 },
      { fullName: 'Ananya Reddy', email: 'ananya.reddy@student.edu', phone: '9988776658', gender: 'female', percentage: 88 },
      { fullName: 'Arjun Mehta', email: 'arjun.mehta@student.edu', phone: '9988776659', gender: 'male', percentage: 72 },
    ];

    const createdStudents = [];
    for (let i = 0; i < studentData.length; i++) {
      const sData = studentData[i];
      
      // Check if student user exists
      let studentUser = await User.findOne({ email: sData.email });
      
      if (!studentUser) {
        const hashedPassword = await bcrypt.hash('student123', 10);
        studentUser = new User({
          email: sData.email,
          password: hashedPassword,
          fullName: sData.fullName,
          phone: sData.phone,
          role: 'student'
        });
        await studentUser.save();
        console.log(`Created student user: ${sData.fullName}`);
      }
      
      createdStudents.push({ user: studentUser, data: sData });
    }

    // Create applications for students
    console.log('\n=== Creating Applications ===');
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const course = courses[i % courses.length];
      
      // Check if application exists
      let application = await Application.findOne({ userId: student.user._id });
      
      if (!application) {
        application = new Application({
          userId: student.user._id,
          courseId: course._id,
          programType: course.programType,
          percentage: student.data.percentage,
          status: 'selected',
          meritRank: i + 1,
          applicationDate: new Date()
        });
        await application.save();
        console.log(`Created application for ${student.data.fullName} - ${course.name}`);
      }
      
      createdStudents[i].application = application;
      createdStudents[i].course = course;
    }

    // Create enrollments for students
    console.log('\n=== Creating Enrollments ===');
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      
      // Check if enrollment exists
      let enrollment = await Enrollment.findOne({ studentId: student.user._id });
      
      if (!enrollment) {
        const enrollmentNo = `EN${currentYear}${String(i + 1).padStart(4, '0')}`;
        const rollNo = `${student.course.code}${currentYear}${String(i + 1).padStart(3, '0')}`;
        
        enrollment = new Enrollment({
          studentId: student.user._id,
          courseId: student.course._id,
          enrollmentNo: enrollmentNo,
          rollNo: rollNo,
          currentSemester: 1,
          enrollmentYear: currentYear,
          status: 'active',
          admissionDate: new Date()
        });
        await enrollment.save();
        console.log(`Created enrollment for ${student.data.fullName}: ${enrollmentNo}`);
      }
      
      createdStudents[i].enrollment = enrollment;
    }

    // Create fees for enrolled students
    console.log('\n=== Creating Fee Records ===');
    for (const student of createdStudents) {
      // Check if fee exists
      const existingFee = await Fee.findOne({ studentId: student.user._id });
      
      if (!existingFee && student.enrollment) {
        const fee = new Fee({
          studentId: student.user._id,
          enrollmentId: student.enrollment._id,
          feeType: 'tuition',
          amount: student.course.feesPerSemester || 50000,
          paidAmount: 0,
          semester: 1,
          academicYear: `${currentYear}-${currentYear + 1}`,
          dueDate: new Date(currentYear, 2, 31), // March 31
          status: 'pending'
        });
        await fee.save();
        console.log(`Created fee record for ${student.data.fullName}`);
      }
    }

    // Create hostel allocations for some students
    console.log('\n=== Creating Hostel Allocations ===');
    const hostels = await Hostel.find();
    
    if (hostels.length > 0) {
      let roomCounter = 101;
      for (let i = 0; i < Math.min(3, createdStudents.length); i++) {
        const student = createdStudents[i];
        
        // Check if allocation exists
        const existingAllocation = await HostelAllocation.findOne({ studentId: student.user._id });
        
        if (!existingAllocation) {
          const hostel = student.data.gender === 'female' 
            ? hostels.find(h => h.gender === 'female') || hostels[0]
            : hostels.find(h => h.gender === 'male') || hostels[0];
          
          const allocation = new HostelAllocation({
            studentId: student.user._id,
            hostelId: hostel._id,
            roomNumber: `${roomCounter++}`,
            status: 'allocated'
          });
          await allocation.save();
          
          // Update hostel available rooms
          await Hostel.findByIdAndUpdate(hostel._id, {
            $inc: { availableRooms: -1 }
          });
          
          console.log(`Allocated hostel for ${student.data.fullName}: ${hostel.name} Room ${allocation.roomNumber}`);
        }
      }
    }

    // Ensure exams exist
    console.log('\n=== Verifying Exams ===');
    const existingExams = await Exam.find();
    if (existingExams.length === 0) {
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
        console.log(`Created exams for ${course.name}`);
      }
    } else {
      console.log(`Found ${existingExams.length} existing exams`);
    }

    console.log('\n=== Seed Complete! ===');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@uniportal.edu / admin123');
    console.log('Faculty: rajesh.kumar@uniportal.edu / faculty123');
    console.log('Faculty: priya.sharma@uniportal.edu / faculty123');
    console.log('Student: rahul.verma@student.edu / student123');
    console.log('Student: sneha.patel@student.edu / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCompleteData();
