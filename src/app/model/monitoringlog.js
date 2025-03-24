import mongoose from "mongoose";

const MonitoringLogSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  activityType: { type: String, enum: ["tab-switch", "multiple-login"], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.MonitoringLog || mongoose.model("MonitoringLog", MonitoringLogSchema);
