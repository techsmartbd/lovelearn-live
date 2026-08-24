import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, type, price, description, originalPrice } = body;
    
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        title,
        type: type || undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        description
      }
    });
    
    return NextResponse.json(updatedPackage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await prisma.package.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}

