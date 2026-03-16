import { prisma } from "@/lib/prisma";
import { PermissionSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getCachedPermissions = unstable_cache(
  async () => {
    return await prisma.permission.findMany({
      select: PermissionSelect,
      orderBy: { createdAt: "desc" },
    });
  },
  ["permissions-list"],
  { tags: ["permissions-list"], revalidate: 3600 }
);
