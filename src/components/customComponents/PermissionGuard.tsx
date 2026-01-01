import React from "react";
import { getAuthUser, getUserPermissions } from "@/lib/get-session";

type PermissionGuardProps = {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default async function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const session = await getAuthUser();

  // Handle single permission check (getUserPermissions only accepts string)
  const permissionToCheck = Array.isArray(permission)
    ? permission[0]
    : permission;
  const { hasPermission } = await getUserPermissions(permissionToCheck);

  if (session?.role?.name !== "admin" || !hasPermission) {
    return fallback;
  }
  return <>{children}</>;
}
