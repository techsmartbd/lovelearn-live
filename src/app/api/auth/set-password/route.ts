import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { encryptPassword } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    const cleanedPhone = (phone || '').trim().replace(/[^0-9]/g, '');

    if (!cleanedPhone || !password || password.length < 6) {
      return NextResponse.json({ error: 'সঠিক মোবাইল নাম্বার এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone: cleanedPhone }
    });

    if (!user) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি!' }, { status: 404 });
    }

    // Verify user has at least one COMPLETED order
    const completedOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      }
    });

    if (!completedOrder) {
      return NextResponse.json({ error: 'আপনার কোনো ভেরিফাইড পেমেন্ট সম্পন্ন অর্ডার পাওয়া যায়নি!' }, { status: 403 });
    }

    // Two-way encrypt password for admin view and secure auth
    const encryptedPassword = encryptPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: encryptedPassword,
        accountStatus: 'ACTIVE',
        isBlocked: false
      }
    });

    // Create session to auto-login
    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, redirectUrl: '/dashboard' });
  } catch (error: any) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: 'সার্ভার এরর, দয়া করে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}
