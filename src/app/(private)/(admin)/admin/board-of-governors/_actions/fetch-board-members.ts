"use server";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { BoardMemberSelect } from "@/lib/types";

export const fetchBoardMembers = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:teachers");

    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const boardMembers = await prisma.boardMember.findMany({
      select: BoardMemberSelect,
    });
    if (!boardMembers) {
      return { error: "No board members found!" };
    }

    return { boardMembers };
  } catch (e) {
    console.error("Could not fetch board members", e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
