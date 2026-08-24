import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    // Fetch the admin user record
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে' }, { status: 500 });
  }
}
