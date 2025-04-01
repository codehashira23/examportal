import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import User from '../../../model/User';
import Exam from '../../../model/Exam';
import Result from '../../../model/Result';

export async function GET() {
  try {
    await dbConnect();

    // Get all students
    const students = await User.find({ role: 'student' })
      .select('name email')
      .sort({ name: 1 });

    // Get all exams
    const exams = await Exam.find()
      .select('title subject maxMarks')
      .sort({ createdAt: -1 });

    // Get all results with populated data
    const results = await Result.find()
      .populate('studentId', 'name email')
      .populate('examId', 'title subject maxMarks')
      .sort({ submittedAt: -1 });

    // Filter out results with missing references and log warnings
    const validResults = results.filter(result => {
      if (!result.studentId || !result.examId) {
        console.warn(`Found invalid result: ${result._id}`, {
          hasStudent: !!result.studentId,
          hasExam: !!result.examId
        });
        return false;
      }
      return true;
    });

    // Format results consistently
    const formattedResults = validResults.map(result => {
      try {
        return {
          _id: result._id,
          studentId: {
            _id: result.studentId._id,
            name: result.studentId.name || 'Unknown Student',
            email: result.studentId.email || 'No email'
          },
          examId: {
            _id: result.examId._id,
            title: result.examId.title || 'Unknown Exam',
            subject: result.examId.subject || 'Unknown Subject',
            maxMarks: result.examId.maxMarks || 0
          },
          score: result.score || 0,
          percentage: result.percentage || 0,
          status: result.status || 'unknown',
          submittedAt: result.submittedAt || new Date(),
          createdAt: result.createdAt || new Date()
        };
      } catch (error) {
        console.error(`Error formatting result ${result._id}:`, error);
        return null;
      }
    }).filter(Boolean);

    // Create a map of student performance
    const studentPerformance = students.map(student => {
      try {
        const studentResults = formattedResults.filter(r => 
          r && r.studentId && r.studentId._id && 
          r.studentId._id.toString() === student._id.toString()
        );
        
        // Calculate student's average score
        const totalScore = studentResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
        const averageScore = studentResults.length > 0 ? totalScore / studentResults.length : 0;

        // Create exam-wise performance
        const examPerformance = exams.map(exam => {
          const examResult = studentResults.find(r => 
            r && r.examId && r.examId._id && 
            r.examId._id.toString() === exam._id.toString()
          );
          return {
            examId: exam._id,
            title: exam.title || 'Unknown Exam',
            subject: exam.subject || 'Unknown Subject',
            maxMarks: exam.maxMarks || 0,
            score: examResult ? examResult.score : null,
            percentage: examResult ? examResult.percentage : null,
            status: examResult ? examResult.status : 'not_attempted'
          };
        });

        return {
          studentId: student._id,
          name: student.name || 'Unknown Student',
          email: student.email || 'No email',
          totalExamsAttempted: studentResults.length,
          averageScore: Number(averageScore.toFixed(2)),
          examPerformance
        };
      } catch (error) {
        console.error(`Error processing student ${student._id}:`, error);
        return null;
      }
    }).filter(Boolean);

    // Log summary
    console.log('Results summary:', {
      totalStudents: students.length,
      totalExams: exams.length,
      totalResults: results.length,
      validResults: validResults.length,
      studentPerformance: studentPerformance.length
    });

    return NextResponse.json({
      students: studentPerformance,
      exams: exams.map(exam => ({
        id: exam._id,
        title: exam.title || 'Unknown Exam',
        subject: exam.subject || 'Unknown Subject',
        maxMarks: exam.maxMarks || 0
      }))
    });

  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch results data", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
