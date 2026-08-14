/** biome-ignore-all assist/source/organizeImports:reason */

import type { Prisma } from "@/generated/prisma/client";
import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ExeatsSelect } from "@/lib/types";

export const getExeatService = async (
  id: string,
  filters: { houseMasterId?: string },
) => {
  const query: Prisma.ExeatWhereInput = filters.houseMasterId
    ? {
        id,
        house: { houseMaster: { userId: filters.houseMasterId } },
      }
    : { id };

  const exeat = await prisma.exeat.findFirst({
    where: query,
    select: ExeatsSelect,
  });

  if (!exeat) throw new ActionError("No record matched the provided ID");

  return exeat;
};
