import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Ensures the upload directories exist
 */
export async function ensureUploadDirectories() {
  try {
    const profilesDir = join(process.cwd(), 'public/uploads/profiles');
    
    if (!existsSync(profilesDir)) {
      await mkdir(profilesDir, { recursive: true });
      console.log('Created profiles upload directory');
    }
  } catch (error) {
    console.error('Error ensuring upload directories exist:', error);
  }
}

/**
 * Get absolute path to the upload directory
 */
export function getUploadPath(subdir = 'profiles') {
  return join(process.cwd(), 'public/uploads', subdir);
} 