import { prisma } from "@/lib/prisma";
import { UserSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedUsers = async () => {
  "use cache";
  cacheTag("users-list");
  cacheLife("max");

  return await prisma.user.findMany({
    select: UserSelect,
  });
};
