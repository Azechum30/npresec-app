/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { ActionError } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { RoleSchema, UpdateRoleSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import "server-only";
import { z } from "zod";

export const createRole = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = RoleSchema.safeParse(values);

      if (!result.success) throw result.error;
      const { name, permissions } = result.data;

      const role = await prisma.role.create({
        data: {
          name,
          permissions: {
            connect: permissions.map((permId) => ({ id: permId })),
          },
        },
      });

      return { role };
    },
    { permission: "create:roles" },
  );

export const updateRole = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = UpdateRoleSchema.safeParse(values);
      if (!result.success) throw result.error;
      const { id, data } = result.data;

      const existing = await prisma.role.findFirst({
        where: {
          id: { not: id },
          name: data.name,
        },
      });

      if (existing)
        throw new ActionError("a user role already exists with this name");

      const updatedRole = await prisma.role.update({
        where: { id },
        data: {
          ...data,
          permissions: {
            set: data.permissions.map((permId) => ({ id: permId })),
          },
        },
      });

      return { role: updatedRole };
    },
    { permission: "edit:roles" },
  );

export const deleteRole = async (value: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:roles");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const result = z.string().safeParse(value);
    if (!result.success) {
      return { error: "A valid ID is required" };
    }

    const id = result.data;

    const role = await prisma.role.delete({ where: { id } });

    if (!role) {
      return { error: "Could not delete role" };
    }

    revalidateTag("roles", "seconds");

    return { role };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not delete role", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};

export const bulkDeleteRoles = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:roles");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const result = z.array(z.string()).safeParse(values);

    if (!result.success) {
      return { error: "Expected an array string IDs" };
    }

    const ids = result.data;

    const payload = await prisma.role.deleteMany({
      where: { id: { in: ids } },
    });

    if (!payload.count) {
      return { error: "Could not delete roles!" };
    }
    revalidateTag("roles", "seconds");
    return { count: payload.count };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not delete roles", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
