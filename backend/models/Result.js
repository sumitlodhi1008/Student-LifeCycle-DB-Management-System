import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  grade: String,
  remarks: String,
  isPass: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

resultSchema.index({ studentId: 1, examId: 1 });
resultSchema.index({ subjectId: 1 });

export default mongoose.model('Result', resultSchema);