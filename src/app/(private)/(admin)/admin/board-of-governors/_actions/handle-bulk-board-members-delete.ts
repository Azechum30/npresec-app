"use server";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { hasPermissions } from "@/lib/hasPermission";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const handleBulkBoardMembersDeleteAction = async (ids: string[]) => {
  try {
    const permission = await hasPermissions("delete:teachers");
    if (!permission) {
      return { error: "permission denied!" };
    }

    const { error, success, data } = z
      .array(z.string().min(1, "Pleas provide valid IDs"))
      .safeParse(ids);

    if (!success || error) {
      const errMessage = error.errors.flatMap((e) => e.message).join(",");
      console.error(errMessage);
      return { error: errMessage };
    }

    const boardMembers = await prisma.boardMember.deleteMany({
      where: { id: { in: data } },
    });

    if (!boardMembers.count) {
      console.error("could not delete any of the board members");
      return { error: "Could not delete any of the board members" };
    }
    revalidatePath("/admin/board-of-governors");

    return { deleteCount: boardMembers.count };
  } catch (e) {
    console.error("Could not delete the selected board members:", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
