import { dbConnect } from "../../../lib/dbConnet";
import { adminMiddleware } from "../../../lib/middleware";
import MonitoringLog from "../../model/monitoringlog";

export async function GET() {
  await dbConnect();
  const auth = await adminMiddleware();
  if (auth.status !== 200) return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });

  const logs = await MonitoringLog.find({})
    .populate("studentId", "name email")
    .populate("examId", "title");

  return new Response(
    JSON.stringify(logs.map((log) => ({
      student: log.studentId.name,
      email: log.studentId.email,
      examTitle: log.examId?.title || "Unknown",
      activityType: log.activityType,
      timestamp: log.timestamp,
    }))),
    { status: 200 }
  );
}
