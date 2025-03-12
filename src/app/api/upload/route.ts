import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);

    // Create buffer from file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return file metadata
    return NextResponse.json({
      id: nanoid(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 