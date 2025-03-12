import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

/**
 * API route for file uploads
 * This is a placeholder implementation that saves files to the public directory
 * In a real implementation, this would use a proper storage solution like S3
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the file
    const id = uuidv4();
    
    // Get the file extension
    const extension = path.extname(file.name);
    
    // Create a unique filename
    const filename = `${id}${extension}`;
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create the uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    
    // Write the file to the uploads directory
    await writeFile(path.join(uploadsDir, filename), buffer);
    
    // Generate the URL for the file
    const url = `/uploads/${filename}`;
    
    // Generate a preview URL for images
    let previewUrl = null;
    if (file.type.startsWith('image/')) {
      previewUrl = url;
    }
    
    // Return the file information
    return NextResponse.json({
      id,
      name: file.name,
      type: file.type,
      url,
      size: file.size,
      previewUrl,
    });
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 