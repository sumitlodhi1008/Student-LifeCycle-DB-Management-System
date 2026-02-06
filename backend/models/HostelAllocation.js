import mongoose from 'mongoose';

const hostelAllocationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['allocated', 'vacated'],
    default: 'allocated'
  },
  vacatedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

hostelAllocationSchema.index({ studentId: 1 });
hostelAllocationSchema.index({ hostelId: 1 });

export default mongoose.model('HostelAllocation', hostelAllocationSchema);