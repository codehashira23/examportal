import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import { getSessionUser } from '../../../../lib/authmiddleware';
import Result from '../../../model/Result';

export async function GET() {
  try {
    await dbConnect();
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch results and populate exam details
    const results = await Result.find({ studentId: user._id })
      .populate('examId', 'title subject maxMarks')
      .sort({ submittedAt: -1 });

    // Filter out results with missing exam references
    const validResults = results.filter(result => result.examId);

    // Format results consistently
    const formattedResults = validResults.map(result => ({
      _id: result._id,
      examId: {
        _id: result.examId._id,
        title: result.examId.title,
        subject: result.examId.subject,
        maxMarks: result.examId.maxMarks
      },
      score: result.score,
      percentage: result.percentage,
      status: result.status,
      submittedAt: result.submittedAt,
      createdAt: result.createdAt
    }));

    // Log warning if there are orphaned results
    if (validResults.length < results.length) {
      console.warn(`Found ${results.length - validResults.length} orphaned results for student ${user._id}`);
      // Optionally, you could delete orphaned results here
      // await Result.deleteMany({ _id: { $nin: validResults.map(r => r._id) } });
    }

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results', details: error.message },
      { status: 500 }
    );
  }
} 