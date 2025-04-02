import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';  
import Exam from '../../../model/Exam';

// GET /api/admin/exams - List all exams
export async function GET() {
  try {
    console.log('Fetching all exams for admin');
    await dbConnect();
    console.log('Database connected');
    
    const exams = await Exam.find({}).sort({ createdAt: -1 });
    console.log(`Found ${exams.length} exams`);
    
    // Ensure consistent data format for exams
    const formattedExams = exams.map(exam => {
      const examObj = exam.toObject();
      console.log(`Exam ${exam._id} scheduled status:`, exam.scheduled);
      
      return {
        ...examObj,
        scheduled: typeof exam.scheduled === 'boolean' ? exam.scheduled : false,
        scheduledAt: exam.scheduledAt || null
      };
    });
    
    console.log('Returning formatted exams to admin');
    return NextResponse.json({ exams: formattedExams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/exams - Create a new exam
export async function POST(request) {
  try {
    console.log('Starting exam creation...');
    await dbConnect();
    const examData = await request.json();

    console.log('Received exam data:', JSON.stringify(examData, null, 2));

    // Validate required fields
    if (!examData.title || !examData.subject || !examData.duration || 
        !examData.maxMarks || !examData.createdBy || !examData.questionSetId) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            title: !examData.title,
            subject: !examData.subject,
            duration: !examData.duration,
            maxMarks: !examData.maxMarks,
            createdBy: !examData.createdBy,
            questionSetId: !examData.questionSetId
          }
        },
        { status: 400 }
      );
    }

    // Validate questions
    if (!examData.questions || examData.questions.length === 0) {
      console.log('Validation failed: No questions provided');
      return NextResponse.json(
        { error: 'At least one question is required' },
        { status: 400 }
      );
    }

    // Validate each question
    for (let i = 0; i < examData.questions.length; i++) {
      const question = examData.questions[i];
      if (!question.question || !question.options || question.options.length < 2) {
        console.log(`Validation failed: Invalid question at index ${i}`);
        return NextResponse.json(
          { 
            error: `Invalid question at index ${i}`,
            details: {
              question: !question.question,
              options: !question.options || question.options.length < 2
            }
          },
          { status: 400 }
        );
      }
    }

    // Calculate total marks from questions
    const totalMarks = examData.questions.reduce((sum, q) => sum + q.marks, 0);
    if (totalMarks !== examData.maxMarks) {
      console.log('Validation failed: Marks mismatch', { totalMarks, examMaxMarks: examData.maxMarks });
      return NextResponse.json(
        { 
          error: 'Total marks from questions does not match exam max marks',
          details: {
            calculatedTotal: totalMarks,
            examMaxMarks: examData.maxMarks
          }
        },
        { status: 400 }
      );
    }

    // Create the exam using Mongoose model
    const exam = new Exam(examData);
    await exam.save();

    console.log('Exam created successfully:', exam);

    return NextResponse.json({
      message: 'Exam created successfully',
      examId: exam._id
    }, { status: 201 });
  } catch (error) {
    console.error('Detailed error creating exam:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create exam',
        details: error.message || 'Unknown error occurred',
        type: error.name
      },
      { status: 500 }
    );
  }
}
