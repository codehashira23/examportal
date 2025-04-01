import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Exam from '../../../../model/Exam';

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