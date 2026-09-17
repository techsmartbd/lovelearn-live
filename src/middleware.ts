import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const adminToken = request.cookies.get('admin_session_token')?.value
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // Subdomain detection: auth.lovelearn.live, auth.localhost, admin.lovelearn.live, etc.
  const isAuthSubdomain = host.startsWith('auth.') || host.startsWith('admin.');

  // Handle Auth Subdomain requests
  if (isAuthSubdomain) {
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If root or /login on auth subdomain
    if (pathname === '/' || pathname === '/login') {
      if (adminToken) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }

    // Protect all /admin routes on auth subdomain
    if (pathname.startsWith('/admin')) {
      if (!adminToken) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  }


  // On Main Domain (not auth subdomain)
  // Hide /admin routes completely to prevent scanning or unauthorized discovery
  if (pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // Dashboard protection on main domain
  if (pathname.startsWith('/dashboard')) {
    if (!token && !adminToken) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return redirectResponse;
    }
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/admin/:path*'],
}

