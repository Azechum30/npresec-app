"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { UpdateUserRoleSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import "server-only";

export const updateUserRole = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:users");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }

    const { error, success, data } = UpdateUserRoleSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error?.issues.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const { userId, roleId } = data;

    const updateUserRoleTransaction = await prisma.$transaction(async (tsx) => {
      await tsx.userRole.deleteMany({
        where: { userId },
      });

      return await prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            create: roleId.map((id) => ({ roleId: id })),
          },
        },
      });
    });

    if (!updateUserRoleTransaction) {
      console.error("Could not update user role");
      return { error: "Could not update user role" };
    }

    revalidatePath("/admin/users");

    return { success: true };
  } catch (e) {
    console.error("Could not update user role", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while updating user role" };
  }
};
