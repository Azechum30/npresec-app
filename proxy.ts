import { UserRole } from "@/auth-types";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/get-session";
import { createAuthRedirect } from "@/utils/auth-redirects";
import { NextRequest, NextResponse } from "next/server";

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
    "/403",
  ]);

  const isPublicRoute =
    publicPaths.has(pathname) ||
    Array.from(publicPaths).some(
      (route) => route !== "/" && pathname.startsWith(route),
    );

  const withPathHeader = (response: NextResponse) => {
    response.headers.set("x-pathname", pathname);
    return response;
  };

  if (isPublicRoute) return withPathHeader(NextResponse.next());

  try {
    const session = (await getSession()) as typeof auth.$Infer.Session;

    if (!session?.user) {
      return withPathHeader(
        NextResponse.redirect(
          new URL(createAuthRedirect(pathname), request.url),
        ),
      );
    }

    if (!session.user.emailVerified && needsEmailVerification(pathname)) {
      return withPathHeader(
        NextResponse.redirect(new URL("/verify-email", request.url)),
      );
    }

    // 1. Extract all role names
    const userRoleNames =
      session.user?.roles?.map((rs) => rs.role.name as UserRole) ?? [];

    if (!requiresRoleBasedAccess(pathname))
      return withPathHeader(NextResponse.next());

    // 2. Multi-Role Access Check
    // A user has access if ANY of their roles are allowed to view this path
    const hasAccess = userRoleNames.some((role) =>
      hasRoleAccess(role, pathname),
    );

    if (!hasAccess) {
      return withPathHeader(
        NextResponse.redirect(new URL("/403", request.url)),
      );
    }

    if (pathname === "/dashboard" || pathname === "/home") {
      const priorityOrder: UserRole[] = [
        "admin",
        "teaching_staff",
        "staff",
        "student",
        "parent",
      ];
      const primaryRole = priorityOrder.find((r) => userRoleNames.includes(r));

      if (primaryRole) {
        const targetPath = getDashboardPath(primaryRole);
        return withPathHeader(
          NextResponse.redirect(new URL(targetPath, request.url)),
        );
      }
    }

    return withPathHeader(NextResponse.next());
  } catch (error) {
    console.error("Middleware Error:", error);
    return withPathHeader(
      NextResponse.redirect(
        new URL("/sign-in?error=server_error", request.url),
      ),
    );
  }
}

function requiresRoleBasedAccess(pathname: string): boolean {
  const protectedPrefixes = [
    "/admin",
    "/teachers",
    "/students",
    "/scores",
    "/dashboard",
    "/home",
    "/profile",
  ];
  return protectedPrefixes.some((path) => pathname.startsWith(path));
}

function needsEmailVerification(pathname: string): boolean {
  const securePrefixes = ["/admin", "/teachers", "/students", "/scores"];
  return securePrefixes.some((path) => pathname.startsWith(path));
}

function hasRoleAccess(role: UserRole, pathname: string): boolean {
  const roleAccessMap: Record<UserRole, string[]> = {
    admin: ["/admin", "/profile", "/403", "/email-verified"],
    teaching_staff: [
      "/teachers",
      "/scores",
      "/profile",
      "/unauthorized",
      "/email-verified",
    ],
    staff: ["/teachers", "/profile", "/403", "/email-verified"],
    student: ["/students", "/profile", "/403", "/email-verified"],
    parent: ["/parents", "/profile", "/403", "/email-verified"],
  };
  return (roleAccessMap[role] ?? []).some((path) => pathname.startsWith(path));
}

function getDashboardPath(role: UserRole): string {
  const dashboardMap: Record<UserRole, string> = {
    admin: "/admin/dashboard",
    teaching_staff: "/teachers",
    staff: "/teachers",
    student: "/students",
    parent: "/parents",
  };
  return dashboardMap[role] || "/";
}
