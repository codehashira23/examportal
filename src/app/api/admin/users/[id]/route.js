import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 