import { dbConnect } from "../../../lib/dbConnet";
import { studentMiddleware } from "../../../lib/middleware";
import Result from "../../model/Result";

export async function GET(req) {
  await dbConnect();
  const auth = await studentMiddleware(req);
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  const exams = await Result.find({ studentId: auth.user.id }).limit(5).populate("examId", "subject");

  return new Response(JSON.stringify(exams.map(e => ({ subject: e.examId.subject, score: e.score }))), { status: 200 });
}
