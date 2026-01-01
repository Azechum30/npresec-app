"use server";
import "server-only";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { RoleSchema, UpdateRoleSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const createRole = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:roles");
    if (!hasPermission) {
      return { error: "Permission denied" };
    }

    const unvalidatedData = RoleSchema.safeParse(values);

    if (!unvalidatedData.success) {
      const zodError = unvalidatedData.error.errors.map(
        (e) => `${e.path[0]}: ${e.message}`,
      );
      return { error: zodError.join("\n") };
    }

    const { name, permissions } = unvalidatedData.data;

    const role = await prisma.role.create({
      data: {
        name,
        permissions: {
          connect: permissions.map((permId) => ({ id: permId })),
        },
      },
    });

    if (!role) {
      return { error: "Could not create role" };
    }

    revalidateTag("roles", "seconds");

    return { role };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not create role", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};

export const updateRole = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:roles");
    if (!hasPermission) {
      return { error: "Permission denied" };
    }

    const result = UpdateRoleSchema.safeParse(values);
    if (!result.success) {
      const zodError = result.error.errors.map(
        (e) => `${e.path[0]}: ${e.message}`,
      );
      return { error: zodError.join("\n") };
    }

    const { id, data } = result.data;

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        ...data,
        permissions: {
          set: data.permissions.map((permId) => ({ id: permId })),
        },
      },
    });

    if (!updatedRole) {
      return { error: "Could not update Role" };
    }

    revalidateTag("roles", "seconds");
    return { role: updatedRole };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not update role", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};

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
