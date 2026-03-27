"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";

export const getBoardMember = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:staff");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }
    const { error, success, data } = z
      .string()
      .min(1, "Please provide a valid ID")
      .safeParse(id);
    if (!success || error) {
      const errorMessage = error.issues.flatMap((e) => e.message).join(",");
      console.error(errorMessage);
      return { error: errorMessage };
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: { id: data },
    });

    if (!boardMember) {
      console.error("No board member with the selected ID exists");
      return { error: "No board member with the selected ID exists" };
    }

    return { boardMember };
  } catch (e) {
    console.error("Could not fetch the specified board member data", e);
    Sentry.captureException(e);
    return { error: "Something went wrong" };
  }
};
