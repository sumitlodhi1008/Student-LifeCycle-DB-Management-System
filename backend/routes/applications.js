import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Course from '../models/Course.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

// Submit application
router.post('/', auth, roleAuth('applicant', 'student'), async (req, res) => {
  try {
    const {
      programType,
      courseId,
      previousQualification,
      previousMarks,
      percentage,
      hostelRequired,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      guardianRelation
    } = req.body;

    // Check if course exists and has seats
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ error: 'No seats available for this course' });
    }

    // Check eligibility
    if (percentage < course.eligibilityPercentage) {
      return res.status(400).json({ 
        error: `Minimum ${course.eligibilityPercentage}% required for this course` 
      });
    }

    // Check if already applied
    const existingApp = await Application.findOne({ 
      userId: req.userId, 
      courseId,
      status: { $in: ['pending', 'selected', 'enrolled'] }
    });
    
    if (existingApp) {
      return res.status(400).json({ error: 'Already applied for this course' });
    }

    // Create application
    const application = new Application({
      userId: req.userId,
      programType,
      courseId,
      previousQualification,
      previousMarks,
      percentage,
      hostelRequired
    });

    await application.save();

    // Update student profile
    await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        dateOfBirth,
        gender,
        address,
        previousQualification,
        previousMarks,
        percentage,
        guardianName,
        guardianPhone,
        guardianRelation,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .populate('courseId', 'name code programType')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications (Admin only)
router.get('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { status, courseId, programType } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;
    if (programType) filter.programType = programType;

    const applications = await Application.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('courseId', 'name code programType')
      .sort({ percentage: -1, applicationDate: 1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status (Admin only)
router.patch('/:id/status', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;