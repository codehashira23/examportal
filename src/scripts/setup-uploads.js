import { mkdir } from 'fs/promises';
import { join } from 'path';

async function setupUploads() {
  try {
    const uploadsDir = join(process.cwd(), 'public/uploads/profiles');
    await mkdir(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully');
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
}

setupUploads(); 