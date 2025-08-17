Hello, I need to restrict access to the `/console` routes so they are only accessible from a specific subdomain in the production environment (e.g., `console.myapp.com`).

Please implement this using Next.js middleware.

The middleware should:
1.  Check if the environment is `production`.
2.  If in production, inspect the request's `hostname` and `pathname`.
3.  If the `pathname` starts with `/console` but the `hostname` is not the specified console hostname, rewrite the request to a `404 Not Found` page.
4.  If the `hostname` *is* the console hostname but the `pathname` does *not* start with `/console` (and is not an internal Next.js or API asset), rewrite that to a `404 Not Found` page as well.
5.  The logic should not apply in development environments to allow for easy testing.
6.  Ensure a generic `app/not-found.tsx` page exists to handle these rewrites gracefully.
7.  The console hostname should be configurable via an environment variable like `NEXT_PUBLIC_CONSOLE_HOSTNAME`.