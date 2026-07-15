/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PermissionSelect } from "@/lib/types";
import "server-only";

import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { z } from "zod";

export const getPermissions = async () =>
  nextSafeAction(
    async () => {
      return {
        permissions: await prisma.permission.findMany({
          select: PermissionSelect,
        }),
      };
    },
    { permission: "view:permissions" },
  );

export const getPermission = async (
  id: string | Prisma.PermissionWhereUniqueInput,
) =>
  nextSafeAction(async () => {
    const { error, success, data } = z
      .string({ error: "A valid ID is required!" })
      .safeParse(id);
    if (!success) throw error;

    const permission = await prisma.permission.findUnique({
      where: { id: data },
      select: PermissionSelect,
    });

    if (!permission) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return permission;
  });
