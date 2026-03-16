import { useAuth } from "@/components/customComponents/SessionProvider";

type PermissionsOptions = {
  requireAll?: boolean;
};

export const useHasPermissions = (
  permissionNames: string | string[],
  option: PermissionsOptions = { requireAll: false },
) => {
  const user = useAuth();

  if (!user) return { hasPermission: false };

  const permissionsToCheck = Array.isArray(permissionNames)
    ? permissionNames
    : [permissionNames];

  const rolePermissions =
    user?.roles?.flatMap((rs) =>
      rs.role?.permissions?.flatMap((p) => p.name),
    ) || [];
  const allPermissions = [...rolePermissions];

  let hasPermission: boolean;

  if (option.requireAll) {
    hasPermission = permissionsToCheck.every((perm) =>
      allPermissions.includes(perm),
    );
  } else {
    hasPermission = permissionsToCheck.some((perm) =>
      allPermissions.includes(perm),
    );
  }

  return { hasPermission };
};
