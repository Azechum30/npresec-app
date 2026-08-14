import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ExeatsSelect } from "@/lib/types";

export const getExeatsDataService = async (filters: {
  houseMasterId?: string;
}) => {
  const query: Prisma.ExeatWhereInput = filters.houseMasterId
    ? { house: { houseMaster: { userId: filters.houseMasterId } } }
    : {};
  return await prisma.exeat.findMany({ where: query, select: ExeatsSelect });
};
