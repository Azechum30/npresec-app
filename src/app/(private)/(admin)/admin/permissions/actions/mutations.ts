"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { PermissionSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { getUserPermissions } from "@/lib/get-session";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

const PermissionEditSchema = PermissionSchema.extend({ id: z.string().cuid() });

export const createPermissions = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:permissions");
    if (!hasPermission) {
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

export const UpdatePermission = async (
  values: z.infer<typeof PermissionEditSchema>,
) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:permissions");
    if (!hasPermission) return { error: "Permission denied!" };

    const { error, success, data } = PermissionEditSchema.safeParse(values);

    if (!success || error) {
      const message = error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join(",");
      return { error: message };
    }

    const { id, permissions } = data;
    const permission = await prisma.permission.update({
      where: { id },
      data: { ...permissions[0] },
    });

    if (!permission) return { error: "Failed to update permission" };

    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          return { error: "Permission name must be unique" };
        case "P2003":
          return { error: "Foreign key contrainst is voilated" };
        case "P2025":
          return { error: "Invalid data format" };
      }
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return { error: "Invalid data format" };
    }
    console.error("Could not update pemission:", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};

export const deletePermission = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:permissions");
    if (!hasPermission) return { error: "Permission denied!" };

    const {
      error,
      success,
      data: permissionId,
    } = z.string().cuid().safeParse(id);

    if (!success) {
      const message = error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join(",");
      return { error: message };
    }

    const permissionToDelete = await prisma.permission.findUnique({
      where: { id: permissionId },
      select: { id: true },
    });

    if (!permissionToDelete)
      return { error: "No Permission with the supplied ID found!" };

    await prisma.permission.delete({ where: { id: permissionToDelete.id } });

    revalidatePath("/admin/permissions");

    return { success: true };
  } catch (e) {
    console.error("Could not delete permission:", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};

export const bulkDeletePermissions = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:permissions");
    if (!hasPermission) return { error: "Permission denied!" };

    const parsed = z.array(z.string().cuid()).safeParse(ids);

    if (!parsed.success) {
      const message = parsed.error.errors
        .flatMap((e) => `Error with ID at index ${e.path[0]}: ${e.message}`)
        .join(",");
      return { error: message };
    }

    const permissionIds = parsed.data;

    const IDsMap = new Map(permissionIds.map((id) => [id, false]));

    const permissionsToDelete = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
      select: { id: true },
    });

    permissionsToDelete.forEach((record) => {
      if (IDsMap.has(record.id)) {
        IDsMap.set(record.id, true);
      }
    });

    const foundIds: string[] = [];
    const missingIds: string[] = [];

    for (const [id, exists] of IDsMap.entries()) {
      if (exists) {
        foundIds.push(id);
      } else {
        missingIds.push(id);
      }
    }

    if (!foundIds.length) return { error: "No permissions found" };

    await prisma.permission.deleteMany({ where: { id: { in: foundIds } } });

    revalidatePath("/admin/permissions");
    return { count: foundIds.length, missingIds };
  } catch (e) {
    console.error("Could not perform bulk delete of permissions:", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
