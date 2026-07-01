"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import "server-only";

export const getSystemSettings = async () =>
  nextSafeAction(async () => {
    const settings = await prisma.setting.findFirst();

    return {
      settings: settings ?? {
        enableEditing: false,
        enableDeleting: false,
        enableScoresEntry: true,
        enableDataExports: false,
      },
    };
  });
