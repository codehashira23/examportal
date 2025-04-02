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

    console.log("Fetching scheduled exams for student");
    
    // Get only scheduled exams with explicit query for scheduled = true
    const exams = await Exam.find(
      { scheduled: true }, 
      'title subject duration maxMarks instructions questions'
    );
    
    console.log(`Found ${exams.length} scheduled exams`);
    
    // Get user's attempted exams
    const attemptedExams = await Result.find(
      { studentId: user._id },
      'examId'
    ).distinct('examId');
    
    console.log(`User has attempted ${attemptedExams.length} exams`);

    // Format exams and add attempt status
    const formattedExams = exams.map(exam => {
      const examId = exam._id.toString();
      const isAttempted = attemptedExams.some(id => id.toString() === examId);
      
      return {
        id: examId,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        maxMarks: exam.maxMarks,
        instructions: exam.instructions,
        questionCount: exam.questions?.length || 0,
        attempted: isAttempted
      };
    });

    console.log(`Returning ${formattedExams.length} exams to student`);
    return NextResponse.json(formattedExams);
  } catch (error) {
    console.error('Error fetching available exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available exams', details: error.message },
      { status: 500 }
    );
  }
} 