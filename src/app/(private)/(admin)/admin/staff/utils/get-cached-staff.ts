import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";
// import { cacheLife, cacheTag } from "next/cache";

export const getCachedStaff = unstable_cache(
  async () => {
    return await prisma.staff.findMany({
      select: StaffSelect,
    });
  },
  ["getCachedStaff"],
  { tags: ["staff"], revalidate: 60 * 60 }
); // Cache for 1 hour
