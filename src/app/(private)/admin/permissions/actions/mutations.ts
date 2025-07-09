"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { PermissionSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { hasPermissions } from "@/lib/hasPermission";

export const createPermissions = async (values: unknown) => {
  try {
    const permission = await hasPermissions("create:permissions");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const result = PermissionSchema.safeParse(values);

    if (!result.success) {
      return { error: "Invalid data format" };
    }

    const { permissions } = result.data;

    const existingPermissions = await prisma.permission.findMany({
      where: {
        name: { in: permissions.map((perm) => perm.name) },
      },
    });

    if (existingPermissions.length > 0) {
      const permNames = existingPermissions.map((per) => per.name);

      return {
        error: `Permission(s) with name(s) ${permNames.join(",")} already exist`,
      };
    }

    const permissionsResult = await prisma.permission.createMany({
      data: permissions,
    });

    if (!permissionsResult.count) {
      return { error: "Could not create permissions" };
    }

    revalidatePath("/admin/permissions");

    return { count: permissionsResult.count };
  } catch (e) {
    Sentry.captureException(e);
    console.error("An error has occurred:", e);
    return { error: getErrorMessage(e) };
  }
};
