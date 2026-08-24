import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sendMetaCapiEvent } from '@/lib/capi';

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

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: true }
    });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    if (status === 'COMPLETED' && existingOrder && existingOrder.status !== 'COMPLETED') {
      try {
        await sendMetaCapiEvent({
          eventName: 'Purchase',
          phone: existingOrder.user?.phone || undefined,
          email: existingOrder.user?.email || undefined,
          name: existingOrder.user?.name || undefined,
          value: existingOrder.amount,
          currency: 'BDT',
          eventId: 'order_' + existingOrder.id + '_purchase',
        });
      } catch (capiErr) {
        console.error('[CAPI] Delayed Purchase event dispatch failed:', capiErr);
      }
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
