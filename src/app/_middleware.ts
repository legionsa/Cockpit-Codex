import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only run on /dashboard routes
  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(new URL('/api/auth/check', request.url));
    if (!response.ok) {
      return NextResponse.redirect(new URL('/logindash', request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/logindash', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*'
};