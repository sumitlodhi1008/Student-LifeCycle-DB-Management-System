import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  designation: String,
  qualification: String,
  specialization: String,
  experience: Number,
  assignedSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  joiningDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

facultySchema.index({ userId: 1 });
facultySchema.index({ employeeId: 1 });
facultySchema.index({ departmentId: 1 });

export default mongoose.model('Faculty', facultySchema);