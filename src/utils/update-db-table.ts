import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type EntityTpe = "user" | "boardMember";
export const updateDbTable = async (
  entityType: EntityTpe,
  entityId: string,
  pictureUrl: string,
) => {
  if (entityType === "user") {
    await prisma.user.update({
      where: { id: entityId },
      data: { image: pictureUrl },
    });
    revalidateTag("students-list", "seconds");
    revalidateTag("users-list", "seconds");
    revalidateTag("staff-list", "seconds");
    return { success: true };
  }

  await prisma.boardMember.update({
    where: { id: entityId },
    data: { picture: pictureUrl },
  });
  revalidateTag("boardMembers-list", "seconds");
  return { success: true };
};
