import { dbConnect } from "../../../lib/dbConnet";
import MonitoringLog from "../../model/monitoringlog";
import { studentMiddleware } from "../../../lib/middleware";

export async function POST(req) {
  await dbConnect();
  const auth = await studentMiddleware();
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  const { examId, activityType } = await req.json();
  const log = new MonitoringLog({ studentId: auth.user.id, examId, activityType });
  await log.save();

  return new Response(JSON.stringify({ message: "Activity logged" }), { status: 201 });
}
