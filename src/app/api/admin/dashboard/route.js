import { NextResponse } from 'next/server';
import {dbConnect} from '../../../../lib/dbConnect';
import User from '../../../model/User';
import Exam from '../../../model/Exam';
import Result from '../../../model/Result';
// import MonitoringLog from '@/models/monitoringlog';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get total exams
    const totalExams = await Exam.countDocuments();
    
    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Get average scores by subject
    const results = await Result.find().populate('examId');
    
    // Calculate average scores by subject
    const subjectScores = {};
    let totalScore = 0;
    let totalResults = 0;
    
    for (const result of results) {
      if (result.examId && result.examId.subject) {
        const subject = result.examId.subject;
        
        if (!subjectScores[subject]) {
          subjectScores[subject] = {
            total: 0,
            count: 0
          };
        }
        
        subjectScores[subject].total += result.score;
        subjectScores[subject].count += 1;
        
        totalScore += result.score;
        totalResults += 1;
      }
    }
    
    // Calculate averages
    const averageScores = {};
    for (const subject in subjectScores) {
      averageScores[subject] = subjectScores[subject].total / subjectScores[subject].count;
    }
    
    // Calculate overall average
    const overallAverage = totalResults > 0 ? totalScore / totalResults : 0;
    
    // Get recent exams
    const recentExams = await Exam.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title subject createdAt');
    
    return NextResponse.json({
      totalExams,
      totalStudents,
      averageScores,
      overallAverage,
      recentExams
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}