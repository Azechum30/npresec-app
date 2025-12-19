import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"], // Protect all routes except static assets
};

export async function proxy(request: NextRequest) {
  const requestHeaders = await headers();

  const publicRoutes = ["/", "/about", "/contact", "/sign-in", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in"));
  }

  return NextResponse.next();
}
