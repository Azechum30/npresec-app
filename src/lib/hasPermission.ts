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
  options: PermissionCheckOptions = { requireAll: false },
): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;

  const permissionsToCheck = Array.isArray(permissionNames)
    ? permissionNames
    : [permissionNames];

  const rolePermissions =
    user.roles?.flatMap((rs) => rs.role.permissions.flatMap((p) => p.name)) ||
    [];
  const allPermissions = [...rolePermissions];

  if (options.requireAll) {
    return permissionsToCheck.every((perm) => allPermissions.includes(perm));
  }

  return permissionsToCheck.some((perm) => allPermissions.includes(perm));
}
