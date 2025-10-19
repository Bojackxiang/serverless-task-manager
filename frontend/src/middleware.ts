import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// Routes that require authentication
const protectedRoutes = ["/tasks", "/profile", "/settings"];

// Routes that are only accessible when NOT authenticated
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth-token")?.value;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Verify token if present
  let isAuthenticated = false;
  if (authToken) {
    try {
      await jwtVerify(authToken, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if accessing protected route without auth
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect to home if accessing auth routes while authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
