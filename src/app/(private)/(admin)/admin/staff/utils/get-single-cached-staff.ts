import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getSingleCachedStaff = unstable_cache(
  async (staffId: string) => {
    return await prisma.staff.findUnique({
      where: { id: staffId },
      select: StaffSelect,
    });
  },
  ["getSingleCachedStaff"],
  {
    tags: ["staff"],
    revalidate: 60 * 60,
  }
);
