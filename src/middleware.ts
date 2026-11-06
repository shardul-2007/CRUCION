import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET || "crucion_fallback_secret_key_dev_only";
const encodedKey = new TextEncoder().encode(secretKey);

// Routes that require authentication
const protectedRoutes = ["/dashboard"];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/signin", "/signup"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Get the session cookie
  const sessionCookie = request.cookies.get("crucion_session")?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey, {
        algorithms: ["HS256"],
      });
      // Check expiration
      if (payload.expiresAt) {
        const expiresAt = new Date(payload.expiresAt as string);
        isAuthenticated = expiresAt > new Date();
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect to signin if accessing a protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect to dashboard if accessing auth routes while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
