/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import "server-only";
import { z } from "zod";
export const deleteUsersAction = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = z
        .object({
          ids: z
            .array(z.string().min(1))
            .nonempty("At least 1 ID must be provided"),
        })
        .safeParse(values);

      if (!success || error) throw error;

      const { ids } = data;

      const UniqueIdsSet = new Set(ids.map((id) => id));

      const existing = await prisma.user.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });

      const idsToDelete = existing
        .filter((user) => UniqueIdsSet.has(user.id))
        .map((user) => user.id);

      const usersToDelete = await prisma.user.deleteMany({
        where: { id: { in: idsToDelete } },
      });

      return { success: true, count: usersToDelete.count };
    },
    { permission: "delete:users" },
  );
