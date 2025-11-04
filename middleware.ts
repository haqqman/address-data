
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: 'firebase-admin' is NOT imported at the top level

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // --- Domain Protection Logic (No changes needed here) ---
  const hostname = nextUrl.hostname;
  const isProduction = process.env.NODE_ENV === 'production';
  const CONSOLE_HOSTNAME = process.env.NEXT_PUBLIC_CONSOLE_HOSTNAME || 'console.localhost';

  if (isProduction) {
    const isOnConsoleDomain = hostname === CONSOLE_HOSTNAME;
    const isAccessingConsole = pathname.startsWith('/console');

    if (isAccessingConsole && !isOnConsoleDomain) {
      const notFoundUrl = new URL('/404', request.url);
      return NextResponse.rewrite(notFoundUrl);
    }
    if (isOnConsoleDomain && !isAccessingConsole) {
      if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
        return NextResponse.next();
      }
      const notFoundUrl = new URL('/404', request.url);
      return NextResponse.rewrite(notFoundUrl);
    }
  }

  // --- Authentication Logic for /console/* routes ---
  if (pathname.startsWith("/console")) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      // Allow access to the console login page itself
      if (pathname === "/console") {
        return NextResponse.next();
      }
      // Redirect all other /console/* requests to the login page
      return NextResponse.redirect(new URL("/console", request.url));
    }

    try {
      // Dynamically import server-side modules ONLY when needed
      const { default: admin } = await import('@/lib/firebase/admin-config');
      const { initAdmin } = await import('@/lib/firebase/admin-config');
      
      // Initialize admin app
      initAdmin();

      const decodedClaims = await admin.auth().verifySessionCookie(session, true);
      const consoleRoles: Array<string | undefined> = [
        "cto",
        "administrator",
        "manager",
      ];

      if (!consoleRoles.includes(decodedClaims.role)) {
        // If role is invalid, redirect to the login page.
        return NextResponse.redirect(new URL("/console", request.url));
      }
      // If session and role are valid, proceed.
      return NextResponse.next();
    } catch (error) {
      // If cookie is invalid, redirect to the login page.
      console.error("Session cookie verification failed:", error);
      return NextResponse.redirect(new URL("/console", request.url));
    }
  }

  // For all other paths, do nothing.
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
