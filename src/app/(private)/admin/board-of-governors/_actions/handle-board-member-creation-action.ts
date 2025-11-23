"use server";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { BoardOfGovernorsSchema } from "@/lib/validation";
import { client } from "@/utils/qstash";
import { revalidatePath } from "next/cache";

export const handleBoardMemberCreationAction = async (values: unknown) => {
  try {
    const permission = await hasPermissions("create:teachers");
    if (!permission) {
      return { error: "You do not have permission to perform this action" };
    }

    const { error, data, success } = BoardOfGovernorsSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error.errors.map((err) => err.message).join(",");
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
      const arrayBuffer = await (data.photo_url as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const jobData = {
        file: {
          buffer: buffer.toString("base64"), // Convert to base64 string
          name: (data.photo_url as File).name,
          type: (data.photo_url as File).type,
        },
        entityId: boardMemberData.id,
        entityType: "boardMember" as const,
        folder: "board-of-governors",
      };

      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: jobData,
      });
    }

    revalidatePath("/admin/board-of-governors");

    return { boardMember: boardMemberData };
  } catch (e) {
    return { error: getErrorMessage(e) };
  }
};
