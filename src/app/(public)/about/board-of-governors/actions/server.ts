/** biome-ignore-all assist/source/organizeImports: reason */

import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

export const getBoardOfGovernors = async () =>
  nextSafeAction(async () => {
    "use cache";
    cacheTag("board-members");
    cacheLife("max");

    const boardMembers = await prisma.boardMember.findMany({
      where: {
        is_active: true,
      },
    });
    return { boardMembers };
  });

export const getBoardOfGovernorsById = async (id: string) =>
  nextSafeAction(async () => {
    const result = z
      .string({ error: "You must provide a valid ID" })
      .safeParse(id);
    if (!result.success) throw result.error;

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        id: result.data,
      },
    });
    if (!boardMember) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
    return { boardMember };
  });
