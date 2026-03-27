"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import "server-only";
import { z } from "zod";
export const deleteUsersAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:users");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z
      .object({
        ids: z
          .array(z.string().min(1))
          .nonempty("At least 1 ID must be provided"),
      })
      .safeParse(values);

    if (!success || error) {
      const errMessage = error.issues.flatMap((e) => e.message).join(",");
      return { error: errMessage };
    }

    const { ids } = data;

    const usersToDelete = await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    if (!usersToDelete.count) return { error: "Failed to delete users" };

    revalidateTag("users-list", "seconds");
    return { success: true, count: usersToDelete.count };
  } catch (e) {
    console.error("Failed to delete users", e);
    Sentry.captureException(e);
    return { error: "Something went wrong! please try again" };
  }
};
