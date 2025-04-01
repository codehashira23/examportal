import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import { getSessionUser } from '../../../../../lib/authmiddleware';
import MonitoringLog from '../../../../model/monitoringlog';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getSessionUser();

    if (!user || !user._id) {
      console.error('No authenticated user found');
      return NextResponse.json({
        error: 'Not authenticated',
        details: 'No valid session found'
      }, { status: 401 });
    }

    const body = await request.json();
    const { examId, activityType } = body;

    console.log('Received monitoring request:', {
      userId: user._id,
      examId,
      activityType
    });

    if (!examId || !activityType) {
      console.error('Missing required fields:', { examId, activityType });
      return NextResponse.json({
        error: 'Missing required fields',
        details: {
          hasExamId: !!examId,
          hasActivityType: !!activityType
        }
      }, { status: 400 });
    }

    // Validate examId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      console.error('Invalid examId format:', examId);
      return NextResponse.json({
        error: 'Invalid examId format',
        details: 'examId must be a valid MongoDB ObjectId'
      }, { status: 400 });
    }

    // Create monitoring log
    const monitoringLog = await MonitoringLog.create({
      studentId: user._id,
      examId: new mongoose.Types.ObjectId(examId),
      activityType: activityType,
      timestamp: new Date()
    });

    console.log('Created monitoring log:', monitoringLog);

    return NextResponse.json({
      success: true,
      log: monitoringLog
    });

  } catch (error) {
    console.error('Error creating monitoring log:', error);
    return NextResponse.json({
      error: 'Failed to create monitoring log',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 