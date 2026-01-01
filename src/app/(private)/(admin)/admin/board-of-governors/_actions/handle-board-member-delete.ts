"use server";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const handleBoardMemberDelete = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:boardmembers");
    if (!hasPermission) return { error: "Permission denied!" };

    const { error, data, success } = z
      .string()
      .min(1, "You must provide a valid ID")
      .safeParse(id);

    if (!success || error) {
      const errMessage = error.errors.map((er) => er.message).join(",");
      return { error: errMessage };
    }

    const boardMember = await prisma.boardMember.delete({
      where: { id: data },
    });

    if (!boardMember) return { error: "Could not delete board member!" };

    revalidatePath("/admin/board-of-governors");

    return { boardMember };
  } catch (e) {
    console.error("could not delete board member", e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
