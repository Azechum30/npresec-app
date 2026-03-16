import { prisma } from "@/lib/prisma";
import { UserSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getCachedUsers = unstable_cache(
  async () => {
    return await prisma.user.findMany({
      select: UserSelect,
      orderBy: { createdAt: "desc" },
    });
  },
  ["users-list"],
  { tags: ["users-list"], revalidate: 3600 }
);
