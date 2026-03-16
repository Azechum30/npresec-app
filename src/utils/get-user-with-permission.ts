import { getAuthUser } from "@/lib/get-session";

export const getUserWithPermissions = async (permissionName: string) => {
  const user = await getAuthUser();

  if (!user) {
    return { user: null, hasPermission: false };
  }

  const rolePermissions =
    user.roles?.flatMap((rs) => rs.role.permissions.flatMap((p) => p.name)) ||
    [];

  const hasPermission = rolePermissions.includes(permissionName);

  return { hasPermission, user };
};
