"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { RolesSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import { z } from "zod";

export const getRoles = async () => {
  try {
    const permission = await hasPermissions("view:role");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const roles = await prisma.role.findMany({
      select: RolesSelect,
    });

    if (!roles) return { error: "No roles found!" };

    return { roles };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch roles", e);
    return { error: getErrorMessage(e) };
  }
};

export const getRole = async (id: string) => {
  try {
    const permission = await hasPermissions("view:role");
    if (!permission) return { error: "Permission denied" };

    const result = z.string().safeParse(id);
    if (!result.success) {
      return {
        error: result.error.errors
          .map((e) => `${e.path[0]}: ${e.message}`)
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
    return { error: getErrorMessage(e) };
  }
};
