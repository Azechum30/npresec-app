"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { BoardOfGovernorsSchema } from "@/lib/validation";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import { revalidateTag } from "next/cache";

export const handleBoardMemberCreationAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:staff");
    if (!hasPermission) {
      return { error: "You do not have permission to perform this action" };
    }

    const { error, data, success } = BoardOfGovernorsSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error.issues.map((err) => err.message).join(",");
      return { error: errorMessage };
    }

    const hasPhotoUrl = data.photo_url instanceof File;

    const { photo_url, ...rest } = data;

    const boardMemberData = await prisma.boardMember.create({
      data: {
        ...rest,
        picture: data.photo_url ? "Upload Pending" : (data.photo_url as string),
      },
    });

    if (hasPhotoUrl) {
      void triggerImageUpload(
        data.photo_url as File,
        boardMemberData.id,
        "board-members",
        "boardMember" as const,
      );
    }

    void revalidateTag("board-members-list", "seconds");

    return { boardMember: boardMemberData };
  } catch (e) {
    return { error: getErrorMessage(e) };
  }
};
