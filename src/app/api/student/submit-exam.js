import { dbConnect } from "../../../lib/dbConnet";
import { studentMiddleware } from "../../../lib/middleware";
import Exam from "../../model/Exam";
import Result from "../../models/Result";

export async function POST(req) {
  await dbConnect();
  const auth = await studentMiddleware();
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  const { examId, answers } = await req.json();
  const exam = await Exam.findById(examId);
  if (!exam) {
    return new Response(JSON.stringify({ message: "Exam not found" }), { status: 404 });
  }

  let score = 0;
  const resultData = answers.map((answer, index) => {
    const isCorrect = answer === exam.questions[index].correctAnswer;
    if (isCorrect) score += 1;
    return { questionId: exam.questions[index]._id, selectedOption: answer, isCorrect };
  });

  const totalScore = (score / exam.questions.length) * 100; // Convert to percentage

  const result = new Result({
    studentId: auth.user.id,
    examId,
    score: totalScore,
    answers: resultData,
  });

  await result.save();

  return new Response(JSON.stringify({ message: "Exam submitted", score: totalScore }), { status: 201 });
}
