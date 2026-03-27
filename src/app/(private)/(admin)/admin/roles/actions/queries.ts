"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { RolesSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import { z } from "zod";
import { getCachedRoles } from "./get-cached-roles";

export const getRoles = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:roles");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const roles = await getCachedRoles();

    return { roles: roles ?? [] };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch roles", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong",
    };
  }
};

export const getRole = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:roles");
    if (!hasPermission) return { error: "Permission denied" };

    const result = z.string().safeParse(id);
    if (!result.success) {
      return {
        error: result.error.issues
          .map((e) => `${e.path[0] as any}: ${e.message}`)
          .join("\n"),
      };
    }

    const { data } = result;

    const role = await prisma.role.findUnique({
      where: { id: data },
      select: RolesSelect,
    });

    if (!role) return { error: "No role found!" };

    return { role };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch role", e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong",
    };
  }
};
