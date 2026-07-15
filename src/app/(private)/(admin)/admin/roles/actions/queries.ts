/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { RolesSelect } from "@/lib/types";
import "server-only";
import { z } from "zod";

export const getRoles = async () =>
  nextSafeAction(
    async () => {
      return { roles: await prisma.role.findMany({ select: RolesSelect }) };
    },
    { permission: "view:roles" },
  );

export const getRole = async (id: string) =>
  nextSafeAction(
    async () => {
      const result = z.string().safeParse(id);
      if (!result.success) throw result.error;

      const { data } = result;

      return {
        role: await prisma.role.findUniqueOrThrow({
          where: { id: data },
          select: RolesSelect,
        }),
      };
    },
    { permission: "view:roles" },
  );
