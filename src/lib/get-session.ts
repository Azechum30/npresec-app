import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

/**
 * Cached session getter with request deduplication
 * This is the single source of truth for session validation
 */
export const getSession = cache(async () => {
  try {
    const currentHeaders = await headers();

    const session = (await auth.api.getSession({
      headers: currentHeaders,
    })) as typeof auth.$Infer.Session;
    return session;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
});

/**
 * Get authenticated user with role information
 * Uses React cache for request deduplication
 */
export const getAuthUser = cache(async () => {
  const session = await getSession();
  return session?.user || null;
});

/**
 * Get user role safely
 * Uses React cache for request deduplication
 */
export const getUserRole = cache(async (): Promise<UserRole[] | null> => {
  const user = await getAuthUser();

  const userRoleNames =
    user?.roles?.flatMap((rs) => rs.role?.name as UserRole).filter(Boolean) ??
    [];

  return userRoleNames.length > 0 ? userRoleNames : null;
});

/**
 * Check if user has a specific role
 * Uses React cache for request deduplication
 */
export const hasRole = cache(async (role: UserRole): Promise<boolean> => {
  const userRole = await getUserRole();
  return userRole?.length ? userRole?.includes(role) : false;
});

/**
 * Check if user has any of the specified roles
 * Uses React cache for request deduplication
 */
export const hasAnyRole = cache(async (roles: UserRole[]): Promise<boolean> => {
  const userRole = await getUserRole();

  return userRole ? roles.some((role) => userRole.includes(role)) : false;
});

/**
 * Comprehensive auth result with error handling
 * Uses React cache for request deduplication
 */
export const getAuthResult = cache(async () => {
  try {
    const session = await getSession();

    if (!session) {
      return {
        session: null,
        user: null,
        error: "No active session",
      };
    }

    return {
      session,
      user: session.user,
    };
  } catch (error) {
    return {
      session: null,
      user: null,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
});

/**
 * Check if user is authenticated
 * Uses React cache for request deduplication
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user;
};

/**
 * Check if user email is verified
 * Uses React cache for request deduplication
 */
export const isEmailVerified = cache(async (): Promise<boolean> => {
  const user = await getAuthUser();
  return user?.emailVerified ?? false;
});

/**
 * Get user permissions (if you extend this later)
 * Uses React cache for request deduplication
 */
export const getUserPermissions = async (permissionName: string) => {
  const user = await getAuthUser();

  if (!user) {
    return { user: null, hasPermission: false };
  }

  const allPermissions = new Set(
    user.roles?.flatMap(
      (userRole) =>
        userRole.role?.permissions
          ?.map((perm) => perm.name.toLowerCase())
          .filter(Boolean) ?? [],
    ) ?? [],
  );

  return {
    hasPermission: allPermissions.has(permissionName.toLowerCase()),
    user,
  };
};

/**
 * Require authentication - throws if not authenticated
 * Uses React cache for request deduplication
 */
export const requireAuth = cache(async () => {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
});

/**
 * Require specific role - throws if user doesn't have role
 * Uses React cache for request deduplication
 */
export const requireRole = cache(async (role: UserRole) => {
  const user = (await requireAuth()) as typeof auth.$Infer.Session.user;
  const userRoleNames = user?.roles?.flatMap((rs) => rs.role?.name ?? []) ?? [];

  const hasAccess = userRoleNames.includes(role);

  if (!hasAccess) {
    redirect("/403");
  }

  return user;
});

/**
 * Require any of the specified roles
 * Uses React cache for request deduplication
 */
export const requireAnyRole = cache(async (roles: UserRole[]) => {
  const user = (await requireAuth()) as typeof auth.$Infer.Session.user;

  const userRoleNames = user?.roles?.flatMap((rs) => rs.role?.name ?? []) ?? [];

  const hasAccess = roles.some((role) => userRoleNames.includes(role));

  if (!userRoleNames.length || !hasAccess) {
    throw new Error(
      `Access denied. One of these roles is required: [${roles.join(", ")}]`,
    );
  }

  return user;
});
