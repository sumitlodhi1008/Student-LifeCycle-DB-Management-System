import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  programType: {
    type: String,
    required: true,
    enum: ['UG', 'PG']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  previousQualification: String,
  previousMarks: Number,
  percentage: Number,
  hostelRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected', 'enrolled'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  meritRank: Number,
  admissionYear: {
    type: Number,
    default: () => new Date().getFullYear()
  }
});

applicationSchema.index({ userId: 1 });
applicationSchema.index({ courseId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ percentage: -1 });

export default mongoose.model('Application', applicationSchema);