import { UserRole } from "@/auth-types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import "server-only";

/**
 * Cached session getter with request deduplication
 * This is the single source of truth for session validation
 */
export const getSession = cache(async () => {
  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as typeof auth.$Infer.Session;

    // Return typed session or null
    return session;
  } catch (error) {
    console.error("Session fetch error:", error);

    // Fallback without headers
    try {
      const fallbackSession =
        (await auth.api.getSession()) as typeof auth.$Infer.Session;
      return fallbackSession;
    } catch (fallbackError) {
      console.error("Fallback session fetch error:", fallbackError);
      return null;
    }
  }
});

/**
 * Get authenticated user with role information
 * Uses React cache for request deduplication
 */
export const getAuthUser = cache(async () => {
  const session = (await getSession()) as typeof auth.$Infer.Session;
  return session?.user || null;
});

/**
 * Get user role safely
 * Uses React cache for request deduplication
 */
export const getUserRole = cache(async (): Promise<UserRole | null> => {
  const user = (await getAuthUser()) as typeof auth.$Infer.Session.user;
  return (user?.role?.name as UserRole) || null;
});

/**
 * Check if user has a specific role
 * Uses React cache for request deduplication
 */
export const hasRole = cache(async (role: UserRole): Promise<boolean> => {
  const userRole = await getUserRole();
  return userRole === role;
});

/**
 * Check if user has any of the specified roles
 * Uses React cache for request deduplication
 */
export const hasAnyRole = cache(async (roles: UserRole[]): Promise<boolean> => {
  const userRole = await getUserRole();
  return userRole ? roles.includes(userRole) : false;
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
export const isAuthenticated = cache(async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user;
});

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
export const getUserPermissions = cache(async (permissionName: string) => {
  const user = (await getAuthUser()) as typeof auth.$Infer.Session.user;

  if (!user) {
    return { user: null, hasPermission: false };
  }

  const userPermissions = user?.permissions?.map((perm) => perm.name) || [];
  const rolePermissions =
    user.role?.permissions?.map((perm) => perm.name) || [];

  const allPermissions = [...userPermissions, ...rolePermissions];

  const hasPermission = allPermissions.includes(permissionName);

  return { hasPermission, user };
});

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
  const userRole = user.role?.name as UserRole;

  if (userRole !== role) {
    throw new Error(`Role '${role}' required`);
  }

  return user;
});

/**
 * Require any of the specified roles
 * Uses React cache for request deduplication
 */
export const requireAnyRole = cache(async (roles: UserRole[]) => {
  const user = (await requireAuth()) as typeof auth.$Infer.Session.user;
  const userRole = user.role?.name as UserRole;

  if (!userRole || !roles.includes(userRole)) {
    throw new Error(`One of roles [${roles.join(", ")}] required`);
  }

  return user;
});
