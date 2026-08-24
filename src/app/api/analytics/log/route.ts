import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { type, userId: reqUserId, details } = await request.json();

    if (!type || !details) {
      return NextResponse.json({ error: 'Type and details are required' }, { status: 400 });
    }

    // Attempt to parse userId from session for authenticity
    let userId = null;
    try {
      const session = await getSession();
      if (session) {
        userId = session.userId;
      }
    } catch (_) {}

    // Fallback to client-provided userId (for landing page tracing or dev testing)
    if (!userId && reqUserId) {
      userId = reqUserId;
    }

    const log = await prisma.activityLog.create({
      data: {
        type,
        userId,
        details: typeof details === 'string' ? details : JSON.stringify(details)
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error("Failed to log activity:", error);
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
}
