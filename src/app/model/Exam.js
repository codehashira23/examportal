import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  questions: [
    {
      questionText: String,
      options: [String], // Array of answer choices
      correctAnswer: String, // The correct choice
    },
  ],
  duration: { type: Number, required: true }, // in minutes
}, 

{ timestamps: true });

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
