import { NextResponse } from 'next/server';
import { clearSession, clearAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/login';
  
  if (redirectTo.includes('/admin') || searchParams.get('type') === 'admin') {
    await clearAdminSession();
  } else {
    await clearSession();
    await clearAdminSession();
  }
  
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const targetPath = redirectTo.startsWith('/admin') ? '/login' : redirectTo;
  return NextResponse.redirect(`${proto}://${host}${targetPath}`);
}


