"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { UserPermissionsFormSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import "server-only";

export const UpdateUserPermissions = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:users");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }

    const { error, success, data } =
      UserPermissionsFormSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error.errors.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const { userId, roleId, permissions } = data;

    const userPermissionsUpdateTransaction = await prisma.$transaction(
      async (tsx) => {
        const user = await tsx.userRole.findFirst({
          where: { userId, roleId: { in: roleId } },
        });

        if (!user) {
          throw new Error("User does not have the specified role");
        }

        return await tsx.role.update({
          where: { id: user.roleId },
          data: {
            permissions: {
              set: permissions.map((p) => ({ id: p })),
            },
          },
        });
      },
    );

    if (!userPermissionsUpdateTransaction) {
      console.error("Could not update user permissions");
      return { error: "Could not update user permissions" };
    }

    revalidateTag("users-list", "seconds");
    return { success: true };
  } catch (e) {
    console.error("Could not update user permissions", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong!",
    };
  }
};
