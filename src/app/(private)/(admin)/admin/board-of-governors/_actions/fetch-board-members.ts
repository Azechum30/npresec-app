"use server";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { BoardMemberSelect } from "@/lib/types";

export const fetchBoardMembers = async () => {
  try {
    const permission = await hasPermissions("view:teachers");

    if (!permission) {
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
