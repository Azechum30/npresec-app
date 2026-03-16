"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const handleBulkBoardMembersDeleteAction = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:staff");
    if (!hasPermission) {
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
    revalidateTag("board-members-list", "seconds");

    return { deleteCount: boardMembers.count };
  } catch (e) {
    console.error("Could not delete the selected board members:", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
