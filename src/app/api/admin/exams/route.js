import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';  
import Exam from '../../../model/Exam';
import mongoose from 'mongoose';

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
      
      // Ensure correctOption is valid
      if (question.correctOption < 0 || question.correctOption >= question.options.length) {
        console.log(`Validation failed: Invalid correctOption for question at index ${i}`);
        question.correctOption = 0; // Set default to first option
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

    // Ensure scheduled property is set
    if (typeof examData.scheduled !== 'boolean') {
      examData.scheduled = false;
    }
    
    // Ensure scheduledAt is set
    if (!examData.scheduledAt) {
      examData.scheduledAt = null;
    }

    // Convert createdBy to ObjectId if it's a string
    if (typeof examData.createdBy === 'string') {
      try {
        examData.createdBy = new mongoose.Types.ObjectId(examData.createdBy);
      } catch (error) {
        console.error('Error converting createdBy to ObjectId:', error);
        return NextResponse.json(
          { 
            error: 'Invalid createdBy format',
            details: error.message
          },
          { status: 400 }
        );
      }
    }

    try {
      // Create the exam using Mongoose model
      console.log('Creating exam document with data:', JSON.stringify({
        title: examData.title,
        subject: examData.subject,
        maxMarks: examData.maxMarks,
        questionCount: examData.questions.length
      }));
      
      const exam = new Exam(examData);
      await exam.save();
      
      console.log('Exam created successfully:', exam._id);

      return NextResponse.json({
        message: 'Exam created successfully',
        examId: exam._id
      }, { status: 201 });
    } catch (saveError) {
      console.error('Detailed save error:', {
        message: saveError.message,
        name: saveError.name,
        code: saveError.code,
        keyPattern: saveError.keyPattern,
        keyValue: saveError.keyValue,
        stringified: JSON.stringify(saveError, Object.getOwnPropertyNames(saveError))
      });
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = {};
        
        // Extract validation error details
        for (const field in saveError.errors) {
          validationErrors[field] = saveError.errors[field].message;
        }
        
        return NextResponse.json(
          { 
            error: 'Validation error',
            details: validationErrors
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Database error saving exam',
          details: saveError.message
        },
        { status: 500 }
      );
    }
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
