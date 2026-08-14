import type { Prisma } from "@/generated/prisma/client";
import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export const deleteExeatsService = async (
  exeatIds: string[],
  filters: { houseMasterId?: string },
) => {
  const query: Prisma.ExeatWhereInput = filters.houseMasterId
    ? {
        id: { in: exeatIds },
        status: "PENDING",
        house: { houseMaster: { userId: filters.houseMasterId } },
      }
    : {
        id: { in: exeatIds },
      };

  const result = await prisma.$transaction(
    async (tsx) => {
      const existing = await tsx.exeat.findMany({
        where: query,
        select: { id: true },
      });

      const exeatIDsSet = new Set(exeatIds.map((id) => id));

      const exeatIdsToDelete = existing
        .filter((exeat) => exeatIDsSet.has(exeat.id))
        .map((exeat) => exeat.id);

      if (exeatIdsToDelete.length === 0)
        throw new ActionError("No record matches the provided IDs");

      return await tsx.exeat.deleteMany({
        where: { id: { in: exeatIdsToDelete } },
      });
    },
    { isolationLevel: "Serializable" },
  );

  await pusher.trigger("cache-invalidation-settings", "delete-exeats", {});

  return result;
};
