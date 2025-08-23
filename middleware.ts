import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes - require ADMIN role
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
      }
    }

    // Protected user routes - require authentication
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/listings/new") ||
      pathname.startsWith("/listings/edit") ||
      pathname === "/favorites" ||
      pathname === "/profile"
    ) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?error=login_required", req.url));
      }
    }

    // Contact form submission - require authentication
    if (pathname === "/contact" && req.method === "POST") {
      if (!token) {
        return NextResponse.redirect(new URL("/login?error=login_required", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages without token
        const publicPaths = [
          "/",
          "/login",
          "/register",
          "/signin",
          "/forgot-password",
          "/reset-password",
          "/about",
          "/listings", // Public listings view only
          "/blog",
          "/api/auth/register",
          "/api/auth/signin",
          "/api/auth/forgot-password",
          "/api/auth/reset-password",
          "/api/property", // Public property API for viewing
        ];

        const pathname = req.nextUrl.pathname;

        // Allow public paths
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // Require token for all other paths
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
