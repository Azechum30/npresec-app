"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { UpdateUserRoleSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserWithPermissions("edit:users");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }

    const { error, success, data } = UpdateUserRoleSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error?.errors.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const { userId, roleId } = data;

    const updateUserRole = await prisma.user.update({
      where: { id: userId },
      data: { roleId: roleId },
    });

    if (!updateUserRole) {
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
