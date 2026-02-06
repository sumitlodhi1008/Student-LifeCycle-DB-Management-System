import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  previousQualification: String,
  previousMarks: Number,
  percentage: Number,
  previousInstitution: String,
  guardianName: String,
  guardianPhone: String,
  guardianRelation: String,
  documents: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentProfileSchema.index({ userId: 1 });

export default mongoose.model('StudentProfile', studentProfileSchema);