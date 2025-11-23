"use server";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const getBoardOfGovernors = async () => {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: {
        is_active: true,
      },
    });

    if (!boardMembers) {
      return { error: "No row found!" };
    }

    return { boardMembers };
  } catch (e) {
    console.error("Could not fetch board of governors", e);
    return { error: getErrorMessage(e) };
  }
};

export const getBoardOfGovernorsById = async (id: string) => {
  try {
    const validId = z
      .string()
      .min(1, "You must provide a valid ID")
      .safeParse(id);
    if (!validId.success) {
      return { error: validId.error.errors.map((e) => e.message).join("\n") };
    }
    const { data } = validId;
    const boardMember = await prisma.boardMember.findUnique({
      where: {
        id: data,
      },
    });
    if (!boardMember) {
      return { error: "Board member not found!" };
    }
    return { boardMember };
  } catch (e) {
    console.error("Could not fetch board of governors by id", e);
    return { error: getErrorMessage(e) };
  }
};
