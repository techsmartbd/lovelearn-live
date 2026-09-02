import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Fetch all SMS logs for Admin Dashboard
export async function GET(req: Request) {
  try {
    const logs = await prisma.smsLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500
    });
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Fetch SMS logs error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a single SMS log or clear all logs
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      await prisma.smsLog.deleteMany({});
      return NextResponse.json({ success: true, message: 'All SMS logs cleared.' });
    }

    if (!id) {
      return NextResponse.json({ error: 'SMS Log ID is required' }, { status: 400 });
    }

    await prisma.smsLog.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'SMS log deleted.' });
  } catch (error: any) {
    console.error("Delete SMS log error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
