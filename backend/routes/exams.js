import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Subject from '../models/Subject.js';

const router = express.Router();

// Create exam (Admin)
router.post('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();

    res.status(201).json({
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exams
router.get('/', auth, async (req, res) => {
  try {
    const { courseId, semester, status } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;

    const exams = await Exam.find(filter)
      .populate('courseId', 'name code')
      .sort({ examDate: -1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload marks (Faculty)
router.post('/results', auth, roleAuth('faculty', 'admin'), async (req, res) => {
  try {
    const { results } = req.body; // Array of { studentId, examId, subjectId, marksObtained }

    const exam = await Exam.findById(results[0].examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const resultRecords = results.map(r => {
      const percentage = (r.marksObtained / exam.maxMarks) * 100;
      let grade = 'F';
      
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';

      return {
        ...r,
        grade,
        isPass: r.marksObtained >= exam.passingMarks
      };
    });

    await Result.insertMany(resultRecords);

    res.json({
      message: 'Results uploaded successfully',
      count: resultRecords.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student results (Student)
router.get('/my-results', auth, roleAuth('student'), async (req, res) => {
  try {
    const { semester } = req.query;

    const results = await Result.find({ studentId: req.userId })
      .populate('examId')
      .populate('subjectId', 'name code credits')
      .sort({ createdAt: -1 });

    let filteredResults = results;
    if (semester) {
      filteredResults = results.filter(r => r.examId.semester === parseInt(semester));
    }

    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results for an exam (Faculty/Admin)
router.get('/:examId/results', auth, roleAuth('faculty', 'admin'), async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('studentId', 'fullName email')
      .populate('subjectId', 'name code')
      .sort({ marksObtained: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;