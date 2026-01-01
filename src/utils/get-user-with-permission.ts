import { getAuthUser } from "@/lib/get-session";

export const getUserWithPermissions = async (permissionName: string) => {
  const user = await getAuthUser();

  if (!user) {
    return { user: null, hasPermission: false };
  }

  const userPermissions = user.permissions?.map((perm) => perm.name) || [];
  const rolePermissions = user.role?.permissions.map((perm) => perm.name) || [];

  const allPermissions = [...userPermissions, ...rolePermissions];

  const hasPermission = allPermissions.includes(permissionName);

  return { hasPermission, user };
};
