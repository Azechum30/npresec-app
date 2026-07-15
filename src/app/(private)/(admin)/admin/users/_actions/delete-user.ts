/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import "server-only";
import { z } from "zod";

export const deleteUserAction = async (id: unknown) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = z
        .object({ id: z.string().min(1) })
        .safeParse(id);

      if (!success) throw error;

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: data.id },
        select: { id: true },
      });

      await prisma.user.delete({
        where: { id: user.id },
      });
    },
    { permission: "delete:users" },
  );
