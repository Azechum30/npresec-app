import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"], // Protect all routes except static assets
};

export async function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/authenticate",
    "/register",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 1. Get the auth cookie
  const authCookie = request.cookies.get("auth-session-token");

  // 2. If no cookie, redirect to the login page
  if (!authCookie) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }

  // 3. Call auth validation API
  const validationUrl = new URL("/api/auth/validate", request.url);
  const authResponse = await fetch(validationUrl, {
    headers: { cookie: `auth-session-token=${authCookie.value}` },
  });

  // 4. Handle failed validation
  if (!authResponse.ok) {
    console.error("Auth validation failed:", authResponse.statusText);
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }

  // 5. Check role-based access
  const { role } = await authResponse.json();
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isTeacherRoute = request.nextUrl.pathname.startsWith("/teachers");
  const isStudentRoute = request.nextUrl.pathname.startsWith("/students");

  if (
    isStudentRoute &&
    role === "student" &&
    request.nextUrl.pathname !== "/students"
  ) {
    return NextResponse.redirect(new URL("/students", request.url));
  }

  if (
    isTeacherRoute &&
    role === "teacher" &&
    request.nextUrl.pathname !== "/teachers"
  ) {
    return NextResponse.redirect(new URL("/teachers", request.url));
  }

  if (
    isAdminRoute &&
    role === "admin" &&
    request.nextUrl.pathname !== "/admin/dashboard"
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}
