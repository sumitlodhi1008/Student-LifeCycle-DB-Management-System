import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentNo: {
    type: String,
    required: true,
    unique: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  currentSemester: {
    type: Number,
    default: 1
  },
  enrollmentYear: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'completed', 'dropped'],
    default: 'active'
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ enrollmentNo: 1 });
enrollmentSchema.index({ courseId: 1 });

export default mongoose.model('Enrollment', enrollmentSchema);