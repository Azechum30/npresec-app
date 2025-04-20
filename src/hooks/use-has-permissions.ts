import { useAuth } from "@/components/customComponents/SessionProvider";

type PermissionsOptions = {
  requireAll?: boolean;
};

export const useHasPermissions = (
  permissionNames: string | string[],
  option: PermissionsOptions = { requireAll: false }
) => {
  const user = useAuth();

  if (!user) return { hasPermission: false };

  const permissionsToCheck = Array.isArray(permissionNames)
    ? permissionNames
    : [permissionNames];

  const userPermissions = user.permissions.map((p) => p.name);
  const rolePermissions = user.role?.permissions.map((rp) => rp.name) || [];
  const allPermissions = [...userPermissions, ...rolePermissions];

  let hasPermission: boolean;

  if (option.requireAll) {
    hasPermission = permissionsToCheck.every((perm) =>
      allPermissions.includes(perm)
    );
  } else {
    hasPermission = permissionsToCheck.some((perm) =>
      allPermissions.includes(perm)
    );
  }

  return { hasPermission };
};
