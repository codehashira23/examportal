import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import User from '../../../model/User';
import { getSessionUser } from '../../../../lib/authmiddleware';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ensureUploadDirectories, getUploadPath } from '../../../lib/upload-helper';

export async function GET() {
  try {
    await dbConnect();
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user data without sensitive information
    const userData = await User.findById(user._id).select('-password');
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const profileImage = formData.get('profileImage');

    // Validate name
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Handle profile image upload
    let profileImageUrl = user.profileImage;
    if (profileImage) {
      try {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(profileImage.type)) {
          return NextResponse.json(
            { error: 'Invalid file type. Please upload a JPEG, PNG, or GIF image.' },
            { status: 400 }
          );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (profileImage.size > maxSize) {
          return NextResponse.json(
            { error: 'File size too large. Maximum size is 5MB.' },
            { status: 400 }
          );
        }

        const bytes = await profileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        await ensureUploadDirectories();
        const uploadDir = getUploadPath();

        // Create unique filename with original extension
        const fileExt = profileImage.name.split('.').pop();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${user._id.toString()}-${uniqueSuffix}.${fileExt}`;
        const path = join(uploadDir, filename);

        // Save file
        await writeFile(path, buffer);

        // Update profile image URL
        profileImageUrl = `/uploads/profiles/${filename}`;
      } catch (error) {
        console.error('Error handling image upload:', error);
        return NextResponse.json(
          { error: 'Failed to upload image. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        profileImage: profileImageUrl
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 