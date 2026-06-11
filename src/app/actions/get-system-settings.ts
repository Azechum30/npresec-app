"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getSystemSettings = async () => {
  try {
    const settings = await prisma.setting.findFirst();

    return {
      settings: settings ?? {
        enableEditing: false,
        enableDeleting: false,
        enableScoresEntry: true,
        enableDataExports: false,
      },
    };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
