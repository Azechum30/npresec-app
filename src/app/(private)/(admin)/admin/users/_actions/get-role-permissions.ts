"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";

export const getRolePermissions = async (roleId: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:users");
    if (!hasPermission) return { error: "Permission denied" };

    if (!roleId || typeof roleId !== "string")
      return { error: "Provide a valid role ID" };

    const rolePermissions = await prisma.role.findFirst({
      where: { id: roleId },
      select: {
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!rolePermissions) return { error: "No role found" };
    return { permissions: rolePermissions.permissions };
  } catch (e) {
    console.error("Could not fetch role permissions", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
