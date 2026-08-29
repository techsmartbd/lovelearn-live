import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const whereClause: any = { role: 'USER' };
    if (type === 'active') {
      whereClause.isBlocked = false;
      whereClause.accountStatus = 'ACTIVE';
    } else if (type === 'pending') {
      whereClause.OR = [
        { isBlocked: true },
        { accountStatus: { not: 'ACTIVE' } }
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        isBlocked: true,
        accountStatus: true,
        expiresAt: true,
        sessions: {
          orderBy: { lastSeen: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, sessionId, expiresAt } = body;

    if (action === 'BLOCK' || action === 'SUSPEND') {
      await prisma.user.update({
        where: { id: userId },
        data: { isBlocked: true, accountStatus: 'SUSPENDED' }
      });
      // Invalidate all active sessions for blocked user
      await prisma.session.updateMany({
        where: { userId },
        data: { isActive: false }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'UNBLOCK') {
      await prisma.user.update({
        where: { id: userId },
        data: { isBlocked: false, accountStatus: 'ACTIVE', expiresAt: null }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'HOLD') {
      await prisma.user.update({
        where: { id: userId },
        data: { accountStatus: 'HOLD' }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'LIMIT_TIME' && expiresAt) {
      await prisma.user.update({
        where: { id: userId },
        data: { accountStatus: 'ACTIVE', expiresAt: new Date(expiresAt) }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE') {
      await prisma.user.delete({
        where: { id: userId }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_SESSION' && sessionId) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
