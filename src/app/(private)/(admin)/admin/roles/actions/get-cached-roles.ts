import { prisma } from "@/lib/prisma";
import { RolesSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";
import "server-only";

export const getCachedRoles = unstable_cache(
  async () => {
    return await prisma.role.findMany({ select: RolesSelect });
  },
  ["roles"],
  {
    tags: ["roles"],
    revalidate: 60 * 60,
  },
);
