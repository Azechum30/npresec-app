"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export const deleteUsersAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserWithPermissions("delete:users");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z
      .object({
        ids: z
          .array(z.string().min(1))
          .nonempty("At least 1 ID must be provided"),
      })
      .safeParse(values);

    if (!success || error) {
      const errMessage = error.errors.flatMap((e) => e.message).join(",");
      return { error: errMessage };
    }

    const { ids } = data;

    const usersToDelete = await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    if (!usersToDelete.count) return { error: "Failed to delete users" };

    revalidatePath("/admin/users");
    return { success: true, count: usersToDelete.count };
  } catch (e) {
    console.error("Failed to delete users", e);
    Sentry.captureException(e);
    return { error: "Something went wrong! please try again" };
  }
};
