import { dbConnect } from "../../../lib/dbConnet";
import { adminMiddleware } from "../../../lib/middleware";
import Exam from "../../model/Exam";

export async function GET() {
  await dbConnect();
  const exams = await Exam.find({});
  return new Response(JSON.stringify(exams), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const auth = await adminMiddleware();
  if (auth.status !== 200) return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });

  const { title, subject, questions, duration } = await req.json();
  const newExam = new Exam({ title, subject, questions, duration });
  await newExam.save();

  return new Response(JSON.stringify({ message: "Exam created" }), { status: 201 });
}

export async function DELETE(req) {
  await dbConnect();
  const auth = await adminMiddleware();
  if (auth.status !== 200) return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });

  const { id } = await req.json();
  await Exam.findByIdAndDelete(id);

  return new Response(JSON.stringify({ message: "Exam deleted" }), { status: 200 });
}
