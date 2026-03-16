"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";

export const getUserRolesAction = async (userId: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:users");
    if (!hasPermission) return { error: "Permission denied" };

    if (!userId || typeof userId !== "string")
      return { error: "Provide a valid user ID" };

    const userRoles = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!userRoles) return { error: "No user found" };
    return { roles: userRoles.roles };
  } catch (e) {
    console.error("Could not fetch user roles", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
