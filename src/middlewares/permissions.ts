import { getAuthUser } from "@/lib/get-session";
import { ORPCError, os } from "@orpc/server";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;

type PermissionMiddlewareOptions = {
  requireAll?: boolean; // If true, user must have ALL permissions
};

/**
 * Helper function to check if user has required permissions
 */
function checkUserPermissions(
  user: AuthUser,
  permissionNames: string | string[],
  options: PermissionMiddlewareOptions = { requireAll: false }
): boolean {
  const permissionsToCheck = Array.isArray(permissionNames)
    ? permissionNames
    : [permissionNames];

  // Get all permission names the user has
  const userPermissions = user.permissions?.map((p) => p.name);
  const rolePermissions = user.role?.permissions?.map((p) => p.name) || [];
  const allPermissions = [...(userPermissions as string[]), ...rolePermissions];

  if (options.requireAll) {
    // User must have ALL specified permissions
    return permissionsToCheck.every((perm) => allPermissions.includes(perm));
  }

  // User needs at least ONE of the specified permissions
  return permissionsToCheck.some((perm) => allPermissions.includes(perm));
}

/**
 * Creates a permission middleware that checks if the user has the required permissions.
 * This middleware expects the context to have a `user` property (from authMiddleware).
 *
 * @param permissionNames - Single permission or array of permissions to check
 * @param options - { requireAll: boolean } - If true, user must have ALL permissions
 * @returns A middleware that can be composed with authMiddleware
 *
 * @example
 * ```ts
 * // Single permission
 * const createHouse = authMiddleware
 *   .use(requirePermissions("create:houses"))
 *   .handler(...)
 *
 * // Multiple permissions (user needs at least one)
 * const updateHouse = authMiddleware
 *   .use(requirePermissions(["update:houses", "edit:houses"]))
 *   .handler(...)
 *
 * // Multiple permissions (user must have all)
 * const deleteHouse = authMiddleware
 *   .use(requirePermissions(["delete:houses", "manage:houses"], { requireAll: true }))
 *   .handler(...)
 * ```
 */
export function requirePermissions(
  permissionNames: string | string[],
  options: PermissionMiddlewareOptions = { requireAll: false }
) {
  return os
    .$context<{ user: AuthUser }>()
    .middleware(async ({ context, next }) => {
      const hasPermission = checkUserPermissions(
        context.user,
        permissionNames,
        options
      );

      if (!hasPermission) {
        throw new ORPCError("FORBIDDEN");
      }

      return next();
    });
}

/**
 * Creates a role-based middleware that checks if the user has the required role.
 * This middleware expects the context to have a `user` property (from authMiddleware).
 *
 * @param roleNames - Single role name or array of role names to check
 * @returns A middleware that can be composed with authMiddleware
 *
 * @example
 * ```ts
 * // Single role
 * const adminOnly = authMiddleware
 *   .use(requireRole("admin"))
 *   .handler(...)
 *
 * // Multiple roles (user needs at least one)
 * const adminOrTeacher = authMiddleware
 *   .use(requireRole(["admin", "teacher"]))
 *   .handler(...)
 * ```
 */
export function requireRole(roleNames: string | string[]) {
  return os
    .$context<{ user: AuthUser }>()
    .middleware(async ({ context, next }) => {
      const rolesToCheck = Array.isArray(roleNames) ? roleNames : [roleNames];
      const userRole = context.user.role?.name;

      if (!userRole || !rolesToCheck.includes(userRole)) {
        throw new ORPCError("FORBIDDEN");
      }

      return next();
    });
}
