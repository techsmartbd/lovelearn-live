import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    // 1. Authorize Admin
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderType = formData.get('type') as string || 'videos'; // 'videos', 'landing', 'ebooks', 'thumbnails'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and generate unique filename
    const originalName = file.name || 'unnamed_file';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}-${sanitizedName}`;

    // --- Local Storage Mode ---
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folderType);
    
    // Ensure local upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${folderType}/${fileName}`;

    return NextResponse.json({ url: fileUrl, mode: 'local' });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
