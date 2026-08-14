/**biome-ignore-all assist/source/organizeImports: reason */

import type { Prisma } from "@/generated/prisma/client";
import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import type { ExeatFormValues } from "@/lib/validation";

export const updateExeatService = async (
  values: ExeatFormValues & { id: string },
  filters: { houseMasterId?: string },
) => {
  const query: Prisma.ExeatWhereInput = filters.houseMasterId
    ? {
        id: values.id,
        house: { houseMaster: { userId: filters.houseMasterId } },
      }
    : { id: values.id };

  await prisma.$transaction(
    async (tsx) => {
      const existing = await tsx.exeat.findFirst({
        where: query,
      });

      if (!existing) throw new ActionError("No record matches the Provided ID");
      const { id, ...rest } = values;

      await tsx.exeat.update({
        where: { id: existing.id },
        data: {
          ...rest,
          departureDate: new Date(rest.departureDate),
          expectedReturnDate: new Date(rest.expectedReturnDate),
        },
      });
    },
    { isolationLevel: "Serializable" },
  );

  await pusher.trigger("cache-invalidation-settings", "update-exeats", {});
};
