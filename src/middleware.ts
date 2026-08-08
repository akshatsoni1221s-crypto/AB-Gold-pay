import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/metal-rates'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authHeader = request.headers.get('authorization');
  const token = request.cookies.get('token')?.value || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect page routes (except login)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|logo.png|products/.*).*)'],
};
