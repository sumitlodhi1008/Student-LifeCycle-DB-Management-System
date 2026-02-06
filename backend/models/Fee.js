import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  feeType: {
    type: String,
    enum: ['tuition', 'hostel', 'exam', 'library', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  semester: Number,
  academicYear: String,
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'waived'],
    default: 'pending'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paidDate: Date,
  transactionId: String,
  paymentMode: String,
  receiptUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

feeSchema.index({ studentId: 1 });
feeSchema.index({ status: 1 });

export default mongoose.model('Fee', feeSchema);