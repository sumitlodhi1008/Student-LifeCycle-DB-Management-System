import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Mark attendance (Faculty)
router.post('/mark', auth, roleAuth('faculty'), async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of { studentId, subjectId, date, status, semester }

    const attendanceRecords = attendanceData.map(record => ({
      ...record,
      facultyId: req.userId,
      date: new Date(record.date)
    }));

    await Attendance.insertMany(attendanceRecords);

    res.json({
      message: 'Attendance marked successfully',
      count: attendanceRecords.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student attendance (Student)
router.get('/my-attendance', auth, roleAuth('student'), async (req, res) => {
  try {
    const { semester, subjectId } = req.query;

    const filter = { studentId: req.userId };
    if (semester) filter.semester = parseInt(semester);
    if (subjectId) filter.subjectId = subjectId;

    const attendance = await Attendance.find(filter)
      .populate('subjectId', 'name code')
      .sort({ date: -1 });

    // Calculate percentage
    const stats = {};
    
    if (subjectId) {
      const total = attendance.length;
      const present = attendance.filter(a => a.status === 'present').length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
      
      stats.total = total;
      stats.present = present;
      stats.absent = total - present;
      stats.percentage = percentage;
    }

    res.json({ attendance, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance for a subject (Faculty)
router.get('/subject/:subjectId', auth, roleAuth('faculty'), async (req, res) => {
  try {
    const { date, semester } = req.query;
    
    const filter = { subjectId: req.params.subjectId };
    if (date) filter.date = new Date(date);
    if (semester) filter.semester = parseInt(semester);

    const attendance = await Attendance.find(filter)
      .populate('studentId', 'fullName email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance statistics (Admin)
router.get('/stats', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { courseId, semester } = req.query;

    const enrollmentFilter = { status: 'active' };
    if (courseId) enrollmentFilter.courseId = courseId;

    const enrollments = await Enrollment.find(enrollmentFilter);
    const studentIds = enrollments.map(e => e.studentId);

    const attendanceFilter = { studentId: { $in: studentIds } };
    if (semester) attendanceFilter.semester = parseInt(semester);

    const totalRecords = await Attendance.countDocuments(attendanceFilter);
    const presentRecords = await Attendance.countDocuments({ 
      ...attendanceFilter, 
      status: 'present' 
    });

    const percentage = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(2) : 0;

    res.json({
      totalStudents: studentIds.length,
      totalRecords,
      presentRecords,
      absentRecords: totalRecords - presentRecords,
      percentage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;