
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const hostname = nextUrl.hostname;
  const pathname = nextUrl.pathname;
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, the console should be on its own subdomain.
  const CONSOLE_HOSTNAME = process.env.NEXT_PUBLIC_CONSOLE_HOSTNAME || 'console.localhost';

  if (isProduction) {
    const isOnConsoleDomain = hostname === CONSOLE_HOSTNAME;
    const isAccessingConsole = pathname.startsWith('/console');

    // Rule 1: If accessing /console, MUST be on the console subdomain.
    if (isAccessingConsole && !isOnConsoleDomain) {
      // Redirect to a 404 page on the current domain to avoid confusion.
      const notFoundUrl = new URL('/404', request.url);
      return NextResponse.rewrite(notFoundUrl);
    }

    // Rule 2: If on the console subdomain, CANNOT access non-console public pages.
    if (isOnConsoleDomain && !isAccessingConsole) {
      // Allow access to API routes and internal Next.js assets
      if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
        return NextResponse.next();
      }
      // Redirect to a 404 on the console domain.
      const notFoundUrl = new URL('/404', request.url);
      return NextResponse.rewrite(notFoundUrl);
    }
  }

  // Allow all other requests in development or that don't match the rules.
  return NextResponse.next();
}

// Specify which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - `/_next/static` (static files)
     * - `/_next/image` (image optimization files)
     * - `favicon.ico` (favicon file)
     * - `/media/` (static assets in public/media)
     * - `/*.svg`, `/*.png`, `/*.jpg` (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|media/.*|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)',
  ],
};
