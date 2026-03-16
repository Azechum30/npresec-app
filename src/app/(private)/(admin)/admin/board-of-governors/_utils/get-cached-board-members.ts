import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCachedBoardMembers = unstable_cache(
  async () => {
    return await prisma.boardMember.findMany();
  },
  ["board-members-list"],
  { tags: ["board-members-list"], revalidate: 3600 }
);
