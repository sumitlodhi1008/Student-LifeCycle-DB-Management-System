import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'co-ed'],
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  availableRooms: {
    type: Number,
    required: true
  },
  capacityPerRoom: {
    type: Number,
    required: true
  },
  feePerSemester: Number,
  amenities: [String],
  address: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

hostelSchema.index({ code: 1 });
hostelSchema.index({ gender: 1 });

export default mongoose.model('Hostel', hostelSchema);