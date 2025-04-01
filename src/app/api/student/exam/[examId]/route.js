import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Exam from '../../../../model/Exam';
import Result from '../../../../model/Result';
import { getSessionUser } from '../../../../../lib/authmiddleware';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Get the current user from the session
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { examId } = params;

    // Check if user has already attempted this exam
    const existingResult = await Result.findOne({
      studentId: user._id,
      examId: examId
    });

    if (existingResult) {
      return NextResponse.json(
        { error: 'You have already attempted this exam' },
        { status: 403 }
      );
    }

    // Fetch exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Format questions to hide correct answers but include all necessary information
    const formattedQuestions = exam.questions.map(q => ({
      id: q._id,
      question: q.question,
      options: q.options || [], // Ensure options is always an array
      marks: q.marks,
      questionType: q.questionType,
      correctAnswer: undefined // Hide correct answer
    }));

    // Debug log
    console.log('Formatted exam data:', {
      id: exam._id,
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      maxMarks: exam.maxMarks,
      questionsCount: formattedQuestions.length,
      sampleQuestion: formattedQuestions[0]
    });

    return NextResponse.json({
      id: exam._id,
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      maxMarks: exam.maxMarks,
      instructions: exam.instructions,
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
} 