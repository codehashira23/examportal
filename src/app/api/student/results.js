import { dbConnect } from "../../../lib/dbConnet";
import { studentMiddleware } from "../../../lib/middleware";
import Result from "../../model/Result";

export async function GET(req) {
  await dbConnect();
  const auth = await studentMiddleware();
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  const results = await Result.find({ studentId: auth.user.id }).populate("examId", "title subject");
  
  return new Response(JSON.stringify(results.map((res) => ({
    examTitle: res.examId.title,
    subject: res.examId.subject,
    score: res.score
  }))), { status: 200 });
}
