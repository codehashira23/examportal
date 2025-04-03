import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import { getSessionUser } from '../../../../lib/authmiddleware';
import Result from '../../../model/Result';

export async function GET() {
  try {
    console.log('Fetching results for student');
    await dbConnect();
    const user = await getSessionUser();

    if (!user) {
      console.log('Unauthorized access attempt to student results');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    console.log(`Fetching results for student ${user._id}`);

    // Fetch results and populate exam details
    const results = await Result.find({ studentId: user._id })
      .populate('examId', 'title subject maxMarks')
      .sort({ submittedAt: -1 });

    console.log(`Found ${results.length} results for student`);

    // Filter out results with missing exam references
    const validResults = results.filter(result => result.examId);

    // Format results consistently
    const formattedResults = validResults.map(result => {
      // Ensure maxMarks is available, default to 100 if missing
      const maxMarks = result.examId?.maxMarks || 100;
      
      // Ensure score is a number
      const score = Number(result.score) || 0;
      
      // Determine pass/fail status (typically 40% is passing)
      const passingThreshold = 0.4; // 40% passing threshold
      const status = score >= (maxMarks * passingThreshold) ? 'passed' : 'failed';
      
      return {
        _id: result._id,
        examId: {
          _id: result.examId._id,
          title: result.examId.title,
          subject: result.examId.subject,
          maxMarks: maxMarks
        },
        score: score,
        status: status,
        submittedAt: result.submittedAt,
        createdAt: result.createdAt
      };
    });

    // Log warning if there are orphaned results
    if (validResults.length < results.length) {
      console.warn(`Found ${results.length - validResults.length} orphaned results for student ${user._id}`);
      // Optionally, you could delete orphaned results here
      // await Result.deleteMany({ _id: { $nin: validResults.map(r => r._id) } });
    }

    console.log('Returning formatted student results');
    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results', details: error.message },
      { status: 500 }
    );
  }
} 