"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserPermissions } from "@/lib/get-session";
import { UserPermissionsFormSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    const { userId, username, permissions } = data;

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { permissions: { set: permissions.map((p) => ({ id: p })) } },
    });

    if (!updateUser) {
      console.error("Could not update user permissions");
      return { error: "Could not update user permissions" };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    console.error("Could not update user permissions", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while updating user permissions" };
  }
};
