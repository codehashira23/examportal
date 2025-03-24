import { dbConnect } from "../../../lib/dbConnet";
import { adminMiddleware } from "../../../lib/middleware";
import Result from "../../model/Result";

export async function GET() {
  await dbConnect();
  const auth = await adminMiddleware();
  if (auth.status !== 200) return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });

  const results = await Result.find({})
    .populate("studentId", "name email")
    .populate("examId", "title");

  return new Response( 
    JSON.stringify(results.map((res) => ({
      student: res.studentId.name,
      email: res.studentId.email,
      examTitle: res.examId.title,
      score: res.score,
    }))),
    { status: 200 }
  );
}
