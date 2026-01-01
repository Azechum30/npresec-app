"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { BoardOfGovernorsSchema } from "@/lib/validation";
import { client } from "@/utils/qstash";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EditSchema = BoardOfGovernorsSchema.extend({
  id: z.string().min(1, "Please provide a valid ID"),
});

export const handleUpdateBoardMemberAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:teachers");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }
    const { error, success, data } = EditSchema.safeParse(values);
    if (!success || error) {
      const errorMessage = error.errors.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const { id, photo_url, ...rest } = data;

    const boardMember = await prisma.boardMember.update({
      where: { id },
      data: {
        ...rest,
        picture:
          photo_url instanceof File ? "Upload Pending" : (photo_url as string),
      },
    });

    if (!boardMember) {
      console.error("Could not update board member");
      return { error: "Could not update board member" };
    }

    if (photo_url instanceof File) {
      const arrayBuffer = await (photo_url as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const jobData = {
        file: {
          buffer: buffer.toString("base64"),
          name: (photo_url as File).name,
          type: (photo_url as File).type,
        },
        entityId: boardMember.id,
        entityType: "boardMember" as const,
        folder: "board-of-governors",
      };

      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: jobData,
      });
    }

    revalidatePath("/admin/board-of-governors");
    return { boardMember };
  } catch (e) {
    console.error("Could not update board member", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
