import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const ebooks = await prisma.ebook.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(ebooks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ebooks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { 
      title, 
      description, 
      pdfUrl, 
      thumbnail,
      packageId,
      isPremium
    } = body;
    
    if (!title || !pdfUrl) {
      return NextResponse.json({ error: 'Title and PDF URL are required' }, { status: 400 });
    }

    const newEbook = await prisma.ebook.create({
      data: {
        title,
        description: description || null,
        pdfUrl,
        thumbnail: thumbnail || null,
        packageId: packageId || null,
        isPremium: isPremium !== undefined ? isPremium : true
      }
    });
    
    return NextResponse.json(newEbook, { status: 201 });
  } catch (error) {
    console.error('Ebook creation error:', error);
    return NextResponse.json({ error: 'Failed to create ebook' }, { status: 500 });
  }
}
