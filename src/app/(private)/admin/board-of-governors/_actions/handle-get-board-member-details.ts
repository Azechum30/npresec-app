"use server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { id } from "date-fns/locale";
import { hasPermissions } from "@/lib/hasPermission";

export const getBoardMember = async (id: string) => {
  try {
    const permission = await hasPermissions("view:teachers");
    if (!permission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }
    const { error, success, data } = z
      .string()
      .min(1, "Please provide a valid ID")
      .safeParse(id);
    if (!success || error) {
      const errorMessage = error.errors.flatMap((e) => e.message).join(",");
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
