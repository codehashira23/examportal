import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import { getSessionUser } from '../../../../../lib/authmiddleware';
import Exam from '../../../../model/Exam';
import Result from '../../../../model/Result';

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { examId, questionId, answer } = await request.json();

    // Validate required fields
    if (!examId || !questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check if user has already submitted the exam
    const existingResult = await Result.findOne({
      examId,
      userId: user._id,
      status: 'completed'
    });

    if (existingResult) {
      return NextResponse.json(
        { error: 'Exam already submitted' },
        { status: 400 }
      );
    }

    // Save or update the answer
    await Result.findOneAndUpdate(
      {
        userId: user._id,
        examId,
        status: 'in-progress'
      },
      {
        $set: {
          [`answers.${questionId}`]: answer
        }
      },
      {
        upsert: true, // Create if doesn't exist
        new: true
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    );
  }
} 