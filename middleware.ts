
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "firebase-admin";

export async function middleware(request: NextRequest) {
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

  const session = request.cookies.get("session")?.value;
  if (pathname.startsWith("/console")) {
    if (!session) {
      if (pathname === "/console") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/console", request.url));
    }

    try {
      const decodedClaims = await auth().verifySessionCookie(session, true);
      const consoleRoles: Array<string | undefined> = [
        "cto",
        "administrator",
        "manager",
      ];
      if (!consoleRoles.includes(decodedClaims.role)) {
        return NextResponse.redirect(new URL("/console", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/console", request.url));
    }
  }
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
