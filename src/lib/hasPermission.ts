import { getAuthUser } from "./get-session";

type PermissionCheckOptions = {
  requireAll?: boolean; // If true, user must have ALL permissions
};

/**
 * Enhanced permission checker with multiple permissions support
 * @param permissionNames - Single permission or array of permissions to check
 * @param options - { requireAll: boolean }
 * @returns Promise<boolean>
 */
export async function hasPermissions(
  permissionNames: string | string[],
  options: PermissionCheckOptions = { requireAll: false }
): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;

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
