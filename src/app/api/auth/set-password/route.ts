import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password || password.length < 6) {
      return NextResponse.json({ error: 'সঠিক মোবাইল নাম্বার এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone }
    });

    if (!user) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি!' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Create session to auto-login
    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, redirectUrl: '/dashboard' });
  } catch (error: any) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: 'সার্ভার এরর, দয়া করে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}
