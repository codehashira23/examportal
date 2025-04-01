import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
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
  answers: {
    type: Map,
    of: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'not_attempted'],
    required: true,
    default: 'not_attempted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);

export default Result;
