import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken';

// In Edge middleware, we can't use jsonwebtoken easily due to Node APIs, 
// so we'll just check if the cookie exists for basic protection in middleware, 
// and do hard verification inside the page components.

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const adminToken = request.cookies.get('admin_session_token')?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    if (!token && !adminToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
