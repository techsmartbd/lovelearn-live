import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const { id } = await params;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
