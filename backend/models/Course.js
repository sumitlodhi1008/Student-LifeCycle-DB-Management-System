import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  programType: {
    type: String,
    required: true,
    enum: ['UG', 'PG']
  },
  duration: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  eligibilityPercentage: {
    type: Number,
    required: true,
    default: 50
  },
  feesPerSemester: Number,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.index({ code: 1 });
courseSchema.index({ departmentId: 1 });
courseSchema.index({ programType: 1 });

export default mongoose.model('Course', courseSchema);