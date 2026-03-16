"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import * as Sentry from "@sentry/nextjs";
import { getCachedBoardMembers } from "../_utils/get-cached-board-members";

export const fetchBoardMembers = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:staff");

    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const boardMembers = await getCachedBoardMembers();
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
