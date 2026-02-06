import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

// Get my enrollment (Student)
router.get('/my-enrollment', auth, roleAuth('student'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ studentId: req.userId })
      .populate('courseId')
      .populate('studentId', 'fullName email phone');

    if (!enrollment) {
      return res.status(404).json({ error: 'No enrollment found' });
    }

    const profile = await StudentProfile.findOne({ userId: req.userId });

    res.json({ enrollment, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all enrollments (Admin)
router.get('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { courseId, status, enrollmentYear } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;
    if (enrollmentYear) filter.enrollmentYear = parseInt(enrollmentYear);

    const enrollments = await Enrollment.find(filter)
      .populate('studentId', 'fullName email phone')
      .populate('courseId', 'name code programType')
      .sort({ enrollmentNo: 1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update enrollment status (Admin)
router.patch('/:id/status', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { status, currentSemester } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (currentSemester) updateData.currentSemester = currentSemester;

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('courseId studentId');

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;