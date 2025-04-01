import { NextResponse } from "next/server";
import {dbConnect} from "../../../../lib/dbConnect";
import MonitoringLog from "../../../model/monitoringlog";
import User from "../../../model/User";
import Exam from "../../../model/Exam";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all monitoring logs with populated student and exam data
    const logs = await MonitoringLog.find()
      .populate("studentId", "name email")
      .populate("examId", "title")
      .sort({ timestamp: -1 });

    // Filter out logs with missing references
    const validLogs = logs.filter(log => {
      if (!log.studentId || !log.examId) {
        console.warn(`Found invalid log: ${log._id}`);
        return false;
      }
      return true;
    });

    // Transform the data to match the required format
    const transformedLogs = validLogs.map(log => {
      try {
        return {
          _id: log._id,
          studentId: log.studentId._id,
          studentName: log.studentId.name || 'Unknown Student',
          examTitle: log.examId.title || 'Unknown Exam',
          tabSwitched: log.activityType === "tab-switch" ? "Yes" : "No",
          timestamp: log.timestamp
        };
      } catch (error) {
        console.error(`Error transforming log ${log._id}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from transformation errors

    // Log warning if there are invalid logs
    if (validLogs.length < logs.length) {
      console.warn(`Found ${logs.length - validLogs.length} invalid monitoring logs`);
    }

    if (transformedLogs.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(transformedLogs);
  } catch (error) {
    console.error("Error fetching monitoring logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitoring logs", details: error.message },
      { status: 500 }
    );
  }
}
