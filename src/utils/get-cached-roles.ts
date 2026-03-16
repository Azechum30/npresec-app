import { prisma } from "@/lib/prisma";
import { RolesSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getCachedRoles = unstable_cache(
  async () => {
    return await prisma.role.findMany({
      select: RolesSelect,
      orderBy: { createdAt: "asc" },
    });
  },
  ["roles-list"],
  { tags: ["roles-list"], revalidate: 3600 }
);
