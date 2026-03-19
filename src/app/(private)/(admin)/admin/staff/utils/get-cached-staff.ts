import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedStaff = async () => {
  "use cache";
  cacheTag("staff-list");
  cacheLife("max");

  return await prisma.staff.findMany({
    select: StaffSelect,
  });
};
