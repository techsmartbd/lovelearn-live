import { NextResponse } from 'next/server';
import { clearSession, clearAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/login';
  
  if (redirectTo.includes('/admin')) {
    await clearAdminSession();
  } else {
    await clearSession();
  }
  
  return NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
