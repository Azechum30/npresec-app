import { prisma } from "@/lib/prisma";
import { PermissionSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedPermissions = async () => {
  "use cache";
  cacheTag("permissions-list");
  cacheLife("max");

  return await prisma.permission.findMany({
    select: PermissionSelect,
  });
};
