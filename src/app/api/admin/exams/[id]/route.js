import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Exam from '../../../../model/Exam';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

// GET /api/admin/exams/[id] - Get a specific exam
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/exams/[id] - Update an exam
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await request.json();

    // Validate required fields if they are being updated
    if (updateData.title === '' || updateData.subject === '' || 
        updateData.duration === '' || updateData.maxMarks === '') {
      return NextResponse.json(
        { error: 'Required fields cannot be empty' },
        { status: 400 }
      );
    }

    const exam = await Exam.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Exam updated successfully',
      exam
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/exams/[id] - Schedule an exam
export async function PATCH(request, { params }) {
  console.log("Schedule Exam API called with ID:", params.id);
  
  if (!params.id || !ObjectId.isValid(params.id)) {
    console.error("Invalid exam ID provided:", params.id);
    return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
  }
  
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connection established");
    
    const { scheduled } = await request.json();
    console.log("Request body:", { scheduled });
    
    if (typeof scheduled !== 'boolean') {
      console.error("Invalid scheduled value:", scheduled);
      return NextResponse.json(
        { error: "Scheduled must be a boolean value" },
        { status: 400 }
      );
    }
    
    console.log(`Attempting to ${scheduled ? 'schedule' : 'unschedule'} exam with ID: ${params.id}`);
    
    // Use the new static method from the Exam model
    const updatedExam = await Exam.toggleSchedule(params.id, scheduled);
    
    if (!updatedExam) {
      console.error(`Exam with ID ${params.id} not found`);
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }
    
    console.log("Exam updated successfully:", {
      id: updatedExam._id,
      title: updatedExam.title,
      scheduled: updatedExam.scheduled,
      scheduledAt: updatedExam.scheduledAt
    });
    
    return NextResponse.json({ 
      message: `Exam ${scheduled ? 'scheduled' : 'unscheduled'} successfully`,
      exam: {
        id: updatedExam._id,
        title: updatedExam.title,
        scheduled: updatedExam.scheduled,
        scheduledAt: updatedExam.scheduledAt
      }
    });
  } catch (error) {
    console.error("Error scheduling exam:", error);
    return NextResponse.json(
      { error: "Failed to update exam", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/exams/[id] - Delete an exam
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
} 