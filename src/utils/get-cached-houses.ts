import { prisma } from "@/lib/prisma";
import { HouseSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getCachedHouses = unstable_cache(
  async () => {
    return await prisma.house.findMany({
      select: HouseSelect,
      orderBy: { name: "asc" },
    });
  },
  ["houses-list"],
  { tags: ["houses-list"], revalidate: 3600 }
);
