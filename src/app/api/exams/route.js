import { dbConnect } from "../../../lib/dbConnet";
import Exam from "../../model/Exam";

export async function GET() {
  await dbConnect();
  const exams = await Exam.find({});
  return new Response(JSON.stringify(exams), { status: 200 });
}
