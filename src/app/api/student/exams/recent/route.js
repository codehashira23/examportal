import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';  
import Result from '../../../../model/Result';
import Exam from '../../../../model/Exam';
import { getSessionUser } from '../../../../../lib/authmiddleware';

export async function GET() {
  try {
    console.log('Fetching recent exams for student');
    await dbConnect();
    
    // Get the current user from the session
    const user = await getSessionUser();
    if (!user) {
      console.log('Unauthorized access attempt to recent exams');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`Fetching recent exams for student ${user._id}`);

    // Fetch recent exam results for the student with more exam details
    const results = await Result.find({ studentId: user._id })
      .populate('examId', 'title subject maxMarks') // Include maxMarks field
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`Found ${results.length} recent exams for student`);

    // Format the results with maxMarks included
    const formattedResults = results.map(result => {
      // Ensure maxMarks is available, default to 100 if missing
      const maxMarks = result.examId?.maxMarks || 100;
      
      // Calculate raw score
      const score = result.score || 0;
      
      // Determine pass/fail status based on 40% threshold
      const passingThreshold = 0.4; // 40% passing threshold
      const isPassed = score >= (maxMarks * passingThreshold);
      
      return {
        id: result._id,
        examName: result.examId.title,
        subject: result.examId.subject,
        score: score,
        maxMarks: maxMarks,
        dateAttempted: new Date(result.createdAt).toLocaleDateString(),
        status: isPassed ? 'Passed' : 'Failed'
      };
    });

    console.log('Returning formatted recent exams results');
    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching recent exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent exams', details: error.message },
      { status: 500 }
    );
  }
} 