import { NextResponse } from 'next/server';
import { ensureUploadDirectories } from '../../../lib/upload-helper';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    // Create upload directory if it doesn't exist
    const profilesDir = join(process.cwd(), 'public/uploads/profiles');
    
    if (!existsSync(profilesDir)) {
      await mkdir(profilesDir, { recursive: true });
      console.log('Created profiles upload directory');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Initialization completed successfully',
      directory: profilesDir
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    return NextResponse.json(
      { error: 'Failed to initialize', details: error.message },
      { status: 500 }
    );
  }
} 