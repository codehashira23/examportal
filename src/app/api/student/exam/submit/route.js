import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import { getSessionUser } from '../../../../../lib/authmiddleware';
import Exam from '../../../../model/Exam';
import Result from '../../../../model/Result';

export async function POST(request) {
  console.log('API: Starting exam submission process');

  try {
    await dbConnect();
    const user = await getSessionUser();

    if (!user || !user._id) {
      return NextResponse.json({
        error: 'Not authenticated',
        details: 'No valid session found'
      }, { status: 401 });
    }

    const body = await request.json();
    const { examId, answers } = body;

    if (!examId || !answers) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: {
          hasExamId: !!examId,
          hasAnswers: !!answers
        }
      }, { status: 400 });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({
        error: 'Exam not found',
        details: { examId }
      }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    let answeredQuestions = 0;
    let totalQuestions = exam.questions.length;

    // Calculate total possible marks
    const totalPossibleMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0);

    // Log the exam questions and answers for debugging
    console.log('Exam questions:', exam.questions.map(q => ({
      id: q._id,
      question: q.question,
      correctOption: q.correctOption,
      marks: q.marks
    })));
    console.log('User answers:', answers);

    // Process each question
    exam.questions.forEach((question) => {
      // Find matching answer by question text instead of ID
      const matchingAnswer = Object.entries(answers).find(([_, answer]) => {
        const userAnswerNum = parseInt(answer);
        const correctAnswerNum = parseInt(question.correctOption);
        
        console.log('Answer comparison:', {
          questionId: question._id,
          questionText: question.question,
          userAnswer: userAnswerNum,
          correctAnswer: correctAnswerNum,
          marks: question.marks
        });

        if (userAnswerNum === correctAnswerNum) {
          score += question.marks;
          answeredQuestions++;
          return true;
        }
        return false;
      });
    });

    // Calculate percentage based on total possible marks
    const percentage = (score / totalPossibleMarks) * 100;
    const status = percentage >= 40 ? 'passed' : 'failed';

    console.log('Final score calculation:', {
      score,
      totalPossibleMarks,
      percentage,
      status,
      answeredQuestions,
      totalQuestions
    });

    // Create result document with answers as a plain object
    const resultData = {
      studentId: user._id,
      userId: user._id,
      examId: examId,
      answers: answers, // Store as plain object
      score: score,
      percentage: percentage,
      status: status,
      submittedAt: new Date()
    };

    const result = await Result.create(resultData);

    return NextResponse.json({
      success: true,
      result: {
        score,
        totalMarks: totalPossibleMarks,
        percentage: percentage.toFixed(2),
        status,
        totalQuestions,
        answeredQuestions,
        examTitle: exam.title,
        subject: exam.subject
      }
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({
      error: 'Submission failed',
      details: error.message
    }, { status: 500 });
  }
} 