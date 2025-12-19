import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type EntityTpe = "user" | "boardMember";
export const updateDbTable = async (
  entityType: EntityTpe,
  entityId: string,
  pictureUrl: string
) => {
  if (entityType === "user") {
    await prisma.user.update({
      where: { id: entityId },
      data: { image: pictureUrl },
    });
    revalidatePath("admin/teachers");
    return { success: true };
  }

  await prisma.boardMember.update({
    where: { id: entityId },
    data: { picture: pictureUrl },
  });
  revalidatePath("admin/board-of-governors");
  return { success: true };
};
