import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Fee from '../models/Fee.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Create fee (Admin)
router.post('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();

    res.status(201).json({
      message: 'Fee created successfully',
      fee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my fees (Student)
router.get('/my-fees', auth, roleAuth('student'), async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.userId })
      .populate('enrollmentId')
      .sort({ dueDate: 1 });

    const summary = {
      total: fees.reduce((sum, f) => sum + f.amount, 0),
      paid: fees.reduce((sum, f) => sum + f.paidAmount, 0),
      pending: fees.filter(f => f.status === 'pending').length,
      overdue: fees.filter(f => f.status === 'overdue').length
    };

    res.json({ fees, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all fees (Admin)
router.get('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { status, feeType } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;

    const fees = await Fee.find(filter)
      .populate('studentId', 'fullName email')
      .populate('enrollmentId')
      .sort({ dueDate: 1 });

    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay fee (Demo - Student)
router.post('/:id/pay', auth, roleAuth('student'), async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    if (fee.studentId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Demo payment - auto success
    fee.paidAmount += amount;
    fee.status = fee.paidAmount >= fee.amount ? 'paid' : 'pending';
    fee.paidDate = new Date();
    fee.transactionId = `TXN${Date.now()}`;
    fee.paymentMode = paymentMode || 'demo';

    await fee.save();

    res.json({
      message: 'Payment successful',
      fee,
      transactionId: fee.transactionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate fee structure for new students (Admin)
router.post('/generate-structure', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { studentId, enrollmentId, courseId, semester, academicYear } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId).populate('courseId');
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const tuitionFee = new Fee({
      studentId,
      enrollmentId,
      feeType: 'tuition',
      amount: enrollment.courseId.feesPerSemester || 50000,
      semester,
      academicYear,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await tuitionFee.save();

    res.json({
      message: 'Fee structure generated successfully',
      fees: [tuitionFee]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;