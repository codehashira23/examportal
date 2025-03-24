import { dbConnect } from "../../../lib/dbConnet";
import Exam from "../../model/Exam";
import User from "../../model/User";
import Result from "../../model/Result";
import { adminMiddleware } from "../../../lib/middleware";

export async function GET(req) {
  await dbConnect();
  const auth = await adminMiddleware(req);
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  const totalExams = await Exam.countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const avgScore = await Result.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }]);

  return new Response(
    JSON.stringify({ totalExams, totalStudents, avgScore: avgScore[0]?.avgScore || 0 }),
    { status: 200 }
  );
}
