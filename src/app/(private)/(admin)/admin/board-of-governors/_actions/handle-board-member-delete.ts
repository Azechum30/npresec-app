"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const handleBoardMemberDelete = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:staff");
    if (!hasPermission) return { error: "Permission denied!" };

    const { error, data, success } = z
      .string()
      .min(1, "You must provide a valid ID")
      .safeParse(id);

    if (!success || error) {
      const errMessage = error.issues.map((er) => er.message).join(",");
      return { error: errMessage };
    }

    const boardMember = await prisma.boardMember.delete({
      where: { id: data },
    });

    if (!boardMember) return { error: "Could not delete board member!" };

    revalidateTag("board-members-list", "seconds");

    return { boardMember };
  } catch (e) {
    console.error("could not delete board member", e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
