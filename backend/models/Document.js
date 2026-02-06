import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentType: {
    type: String,
    enum: ['admission_card', 'id_card', 'marksheet', 'certificate', 'fee_receipt', 'other'],
    required: true
  },
  title: String,
  fileUrl: {
    type: String,
    required: true
  },
  cloudinaryId: String,
  semester: Number,
  academicYear: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

documentSchema.index({ userId: 1 });
documentSchema.index({ documentType: 1 });

export default mongoose.model('Document', documentSchema);