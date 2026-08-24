import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { deleteCloudinaryFile } from '@/lib/cloudinary';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolvedParams = await params;
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

    const updatedEbook = await prisma.ebook.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description: description || null,
        pdfUrl,
        thumbnail: thumbnail || null,
        packageId: packageId || null,
        isPremium: isPremium !== undefined ? isPremium : true
      }
    });

    return NextResponse.json(updatedEbook);
  } catch (error) {
    console.error('Ebook update error:', error);
    return NextResponse.json({ error: 'Failed to update ebook' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolvedParams = await params;

    const ebookToDelete = await prisma.ebook.findUnique({
      where: { id: resolvedParams.id }
    });

    if (ebookToDelete?.pdfUrl) {
      await deleteCloudinaryFile(ebookToDelete.pdfUrl);
    }

    await prisma.ebook.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ebook delete error:', error);
    return NextResponse.json({ error: 'Failed to delete ebook' }, { status: 500 });
  }
}
