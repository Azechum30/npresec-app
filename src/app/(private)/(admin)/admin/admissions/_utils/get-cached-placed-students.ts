import { prisma } from "@/lib/prisma";
import { PlacementListSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedPlacedStudents = async () => {
  "use cache";
  cacheTag("placement-list");
  cacheLife("max");

  return await prisma.admission.findMany({
    select: PlacementListSelect,
  });
};
