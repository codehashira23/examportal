import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';  
import Result from '../../../../model/Result';
import Exam from '../../../../model/Exam';
import { getSessionUser } from '../../../../../lib/authmiddleware';

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

    // Fetch recent exam results for the student
    const results = await Result.find({ studentId: user._id })
      .populate('examId', 'title subject')
      .sort({ createdAt: -1 })
      .limit(5);

    // Format the results
    const formattedResults = results.map(result => ({
      id: result._id,
      examName: result.examId.title,
      subject: result.examId.subject,
      score: result.score,
      dateAttempted: new Date(result.createdAt).toLocaleDateString(),
      status: result.score >= 40 ? 'Passed' : 'Failed'
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching recent exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent exams' },
      { status: 500 }
    );
  }
} 