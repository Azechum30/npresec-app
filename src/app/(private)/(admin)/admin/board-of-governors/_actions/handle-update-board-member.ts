"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { BoardOfGovernorsSchema } from "@/lib/validation";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const EditSchema = BoardOfGovernorsSchema.extend({
  id: z.string().min(1, "Please provide a valid ID"),
});

export const handleUpdateBoardMemberAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:staff");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }
    const { error, success, data } = EditSchema.safeParse(values);
    if (!success || error) {
      const errorMessage = error.issues.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const { id, photo_url, ...rest } = data;

    const boardMember = await prisma.boardMember.update({
      where: { id },
      data: rest,
    });

    if (!boardMember) {
      console.error("Could not update board member");
      return { error: "Could not update board member" };
    }

    if (photo_url instanceof File) {
      void triggerImageUpload(
        photo_url as File,
        boardMember.id,
        "board-members",
        "boardMember" as const,
      );
    }
    void revalidateTag("board-members-list", "seconds");
    return { boardMember };
  } catch (e) {
    console.error("Could not update board member", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong!",
    };
  }
};
