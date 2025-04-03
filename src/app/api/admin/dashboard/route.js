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
    let totalPercentage = 0;
    let totalResults = 0;
    
    for (const result of results) {
      if (result.examId && result.examId.subject) {
        const subject = result.examId.subject;
        
        if (!subjectScores[subject]) {
          subjectScores[subject] = {
            totalPercentage: 0,
            count: 0
          };
        }
        
        // Use percentage instead of raw score for better comparison across exams
        subjectScores[subject].totalPercentage += result.percentage;
        subjectScores[subject].count += 1;
        
        totalPercentage += result.percentage;
        totalResults += 1;
      }
    }
    
    // Calculate averages
    const averageScores = {};
    for (const subject in subjectScores) {
      // Round to 2 decimal places for cleaner display
      averageScores[subject] = parseFloat((subjectScores[subject].totalPercentage / subjectScores[subject].count).toFixed(2));
    }
    
    // Calculate overall average
    const overallAverage = totalResults > 0 ? 
      parseFloat((totalPercentage / totalResults).toFixed(2)) : 
      0;
    
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