import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Hostel from '../models/Hostel.js';
import Faculty from '../models/Faculty.js';

const router = express.Router();

// Get dashboard statistics (Admin)
router.get('/dashboard-stats', auth, roleAuth('admin'), async (req, res) => {
  try {
    // Applications
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const selectedApplications = await Application.countDocuments({ status: 'selected' });

    // Students
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });

    // Courses
    const totalCourses = await Course.countDocuments({ isActive: true });
    const courses = await Course.find({ isActive: true });
    const totalSeats = courses.reduce((sum, c) => sum + c.totalSeats, 0);
    const availableSeats = courses.reduce((sum, c) => sum + c.availableSeats, 0);

    // Fees
    const totalFees = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paidFees = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);
    const pendingFees = await Fee.countDocuments({ status: 'pending' });

    // Hostels
    const totalHostels = await Hostel.countDocuments({ isActive: true });
    const hostels = await Hostel.find({ isActive: true });
    const hostelOccupancy = hostels.reduce((sum, h) => sum + (h.totalRooms - h.availableRooms), 0);
    const hostelCapacity = hostels.reduce((sum, h) => sum + h.totalRooms, 0);

    // Faculty
    const totalFaculty = await Faculty.countDocuments({ isActive: true });

    res.json({
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        selected: selectedApplications
      },
      students: {
        total: totalStudents,
        active: activeEnrollments
      },
      courses: {
        total: totalCourses,
        totalSeats,
        availableSeats,
        filledSeats: totalSeats - availableSeats
      },
      fees: {
        total: totalFees[0]?.total || 0,
        paid: paidFees[0]?.total || 0,
        pending: pendingFees
      },
      hostels: {
        total: totalHostels,
        occupancy: hostelOccupancy,
        capacity: hostelCapacity,
        available: hostelCapacity - hostelOccupancy
      },
      faculty: {
        total: totalFaculty
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course-wise enrollment stats
router.get('/course-stats', auth, roleAuth('admin'), async (req, res) => {
  try {
    const stats = await Enrollment.aggregate([
      {
        $group: {
          _id: '$courseId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          courseName: '$course.name',
          courseCode: '$course.code',
          studentCount: '$count',
          totalSeats: '$course.totalSeats'
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;