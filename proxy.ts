import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { createAuthRedirect } from "@/utils/auth-redirects";
import { UserRole } from "@/auth-types";
import { auth } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = new Set([
    "/",
    "/about",
    "/about/vision-mission",
    "/about/board-of-governors",
    "/sign-in",
    "/forgot-password",
    "/reset-password",
    "/reset-password-notice",
    "/unauthorized",
  ]);

  const isPublicRoute =
    publicPaths.has(pathname) ||
    Array.from(publicPaths).some(
      (route) => route !== "/" && pathname.startsWith(route),
    );

  // Helper: clone request and set custom header
  const withPathHeader = (response: NextResponse) => {
    response.headers.set("x-pathname", pathname);
    return response;
  };

  if (isPublicRoute) {
    return withPathHeader(
      NextResponse.next({
        request: {
          headers: new Headers(request.headers),
        },
      }),
    );
  }

  try {
    const session = (await getSession()) as typeof auth.$Infer.Session;

    if (!session?.user) {
      const signInPath = createAuthRedirect(pathname);
      return withPathHeader(
        NextResponse.redirect(new URL(signInPath, request.url), {
          headers: new Headers(request.headers),
        }),
      );
    }

    const needsRoleCheck = requiresRoleBasedAccess(pathname);

    if (!needsRoleCheck) {
      return withPathHeader(
        NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        }),
      );
    }

    if (!session.user.emailVerified && needsEmailVerification(pathname)) {
      return withPathHeader(
        NextResponse.redirect(new URL("/verify-email", request.url), {
          headers: new Headers(request.headers),
        }),
      );
    }

    const userRole = session.user.role?.name as UserRole;
    const validRoles: UserRole[] = [
      "admin",
      "teaching_staff",
      "staff",
      "student",
      "parent",
    ];

    if (!userRole || !validRoles.includes(userRole)) {
      return withPathHeader(
        NextResponse.redirect(new URL("/403", request.url), {
          headers: new Headers(request.headers),
        }),
      );
    }

    if (!hasRoleAccess(userRole, pathname)) {
      return withPathHeader(
        NextResponse.redirect(new URL("/403", request.url), {
          headers: new Headers(request.headers),
        }),
      );
    }

    if (pathname === "/dashboard" || pathname === "/home") {
      const dashboardPath = getDashboardPath(userRole);
      if (dashboardPath) {
        return withPathHeader(
          NextResponse.redirect(new URL(dashboardPath, request.url), {
            headers: new Headers(request.headers),
          }),
        );
      }
    }

    return withPathHeader(
      NextResponse.next({
        request: {
          headers: new Headers(request.headers),
        },
      }),
    );
  } catch (error) {
    console.error("Proxy middleware error:", error);
    const signInPath = createAuthRedirect(pathname);
    const signInUrl = new URL(signInPath, request.url);
    signInUrl.searchParams.set("error", "authentication_failed");
    return withPathHeader(
      NextResponse.redirect(signInUrl, {
        headers: new Headers(request.headers),
      }),
    );
  }
}

/** Helpers */
function requiresRoleBasedAccess(pathname: string): boolean {
  const roleProtectedPaths = [
    "/admin",
    "/teachers",
    "/students",
    "/scores",
    "/dashboard",
    "/home",
    "/profile",
  ];
  return roleProtectedPaths.some((path) => pathname.startsWith(path));
}

function needsEmailVerification(pathname: string): boolean {
  const verificationRequiredPaths = [
    "/admin",
    "/teachers",
    "/students",
    "/scores",
  ];
  return verificationRequiredPaths.some((path) => pathname.startsWith(path));
}

function hasRoleAccess(role: UserRole, pathname: string): boolean {
  const roleAccessMap: Record<UserRole, string[]> = {
    admin: ["/admin", "/profile", "/403", "/email-verified"],
    teaching_staff: [
      "/teachers",
      "/scores",
      "/profile",
      "/403",
      "/email-verified",
    ],
    staff: ["/teachers", "/profile", "/403", "/email-verified"],
    student: ["/students", "/profile", "/403", "/email-verified"],
    parent: ["/parents", "/profile", "/403", "/email-verified"],
  };
  const allowedPaths = roleAccessMap[role] || [];
  return allowedPaths.some((path) => pathname.startsWith(path));
}

function getDashboardPath(role: UserRole): string | null {
  const dashboardMap: Record<UserRole, string> = {
    admin: "/admin/dashboard",
    teaching_staff: "/teachers",
    staff: "/teachers",
    student: "/students",
    parent: "/parents",
  };
  return dashboardMap[role] || null;
}
