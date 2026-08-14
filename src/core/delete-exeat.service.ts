import type { Prisma } from "@/generated/prisma/client";
import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export const deleteExeatService = async (
  exeatId: string,
  filters: { houseMasterId?: string },
) => {
  const query: Prisma.ExeatWhereInput = filters.houseMasterId
    ? {
        id: exeatId,
        status: "PENDING",
        house: { houseMaster: { userId: filters.houseMasterId } },
      }
    : {
        id: exeatId,
      };

  await prisma.$transaction(
    async (tsx) => {
      const existing = await tsx.exeat.findFirst({
        where: query,
        select: { id: true },
      });

      if (!existing) throw new ActionError("No record matched the provided ID");

      await tsx.exeat.delete({
        where: { id: existing.id },
      });
    },
    { isolationLevel: "Serializable" },
  );

  await pusher.trigger("cache-invalidation-settings", "delete-exeat", {});
};
