/** biome-ignore-all assist/source/organizeImports: reason */
import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";
import { getQueryKey } from "./get-query-key";

export const getCachedStaff = async () => {
  "use cache";
  cacheTag(getQueryKey().staff.all[0]);
  cacheLife("max");

  return await prisma.staff.findMany({
    select: StaffSelect,
    orderBy: { lastName: "asc" },
  });
};
