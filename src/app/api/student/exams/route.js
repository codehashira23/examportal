import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Exam from '../../../model/Exam';
import Result from '../../../model/Result';
import { getSessionUser } from '../../../../lib/authmiddleware';

export async function GET() {
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

    // Get all exams
    const exams = await Exam.find({}, 'title subject duration maxMarks instructions');
    
    // Get user's attempted exams
    const attemptedExams = await Result.find(
      { studentId: user._id },
      'examId'
    ).distinct('examId');

    // Format exams and add attempt status
    const formattedExams = exams.map(exam => ({
      id: exam._id,
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      maxMarks: exam.maxMarks,
      instructions: exam.instructions,
      attempted: attemptedExams.includes(exam._id)
    }));

    return NextResponse.json(formattedExams);
  } catch (error) {
    console.error('Error fetching available exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available exams' },
      { status: 500 }
    );
  }
} 