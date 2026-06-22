/** biome-ignore-all assist/source/organizeImports: reason */

import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";
import { getQueryKey } from "./get-query-key";

export const getSingleCachedStaff = async (staffId: string) => {
  "use cache";
  cacheTag(...(getQueryKey(staffId).staff.single as string[]));
  cacheLife("max");

  return await prisma.staff.findUnique({
    where: { id: staffId },
    select: StaffSelect,
  });
};
