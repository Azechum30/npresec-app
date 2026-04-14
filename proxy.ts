import { auth } from "@/lib/auth";
import { getSession } from "@/lib/get-session";
import { UserRole } from "@/lib/types";
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

    const isSetupPage = pathname === "/setup-2fa";

    if (!("twoFactorEnabled" in session.user) && !isSetupPage) {
      return withPathHeader(
        NextResponse.redirect(new URL("/setup-2fa", request.url)),
      );
    }

    if ("twoFactorEnabled" in session.user) {
      if (session.user.twoFactorEnabled && isSetupPage) {
        const userRoleNames =
          session.user?.roles?.map((rs) => rs.role.name as UserRole) ?? [];
        const priorityOrder: UserRole[] = [
          "admin",
          "teaching_staff",
          "staff",
          "student",
          "parent",
        ];
        const primaryRole = priorityOrder.find((r) =>
          userRoleNames.includes(r),
        );

        if (primaryRole) {
          const targetPath = getDashboardPath(primaryRole);
          return withPathHeader(
            NextResponse.redirect(new URL(targetPath, request.url)),
          );
        }
        return withPathHeader(
          NextResponse.redirect(new URL("/profile", request.url)),
        );
      }
    }

    if (isSetupPage) {
      return withPathHeader(NextResponse.next());
    }

    if (!session.user.emailVerified && needsEmailVerification(pathname)) {
      return withPathHeader(
        NextResponse.redirect(new URL("/verify-email", request.url)),
      );
    }

    const userRoleNames =
      session.user?.roles?.map((rs) => rs.role.name as UserRole) ?? [];

    if (!requiresRoleBasedAccess(pathname))
      return withPathHeader(NextResponse.next());

    const hasAccess = userRoleNames.some((role) =>
      hasRoleAccess(role, pathname),
    );

    if (!hasAccess) {
      return withPathHeader(
        NextResponse.redirect(new URL("/403", request.url)),
      );
    }

    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/staff") ||
      pathname.startsWith("/students")
    ) {
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
    "/staff",
    "/students",
    "/scores",
    "/profile",
  ];
  return protectedPrefixes.some((path) => pathname.startsWith(path));
}

function needsEmailVerification(pathname: string): boolean {
  const securePrefixes = ["/admin", "/staff", "/students"];
  return securePrefixes.some((path) => pathname.startsWith(path));
}

function hasRoleAccess(role: UserRole, pathname: string): boolean {
  const roleAccessMap: Record<UserRole, string[]> = {
    admin: ["/admin", "/profile", "/403", "/email-verified"],
    teaching_staff: [
      "/staff",
      "/profile",
      "/unauthorized",
      "/email-verified",
      "/403",
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
    teaching_staff: "/staff/dashboard",
    staff: "/teachers",
    student: "/students",
    parent: "/parents",
  };
  return dashboardMap[role] || "/";
}
