"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getServiceTypes = async () => {
  try {
    const serviceTypes = await prisma.fee.findMany({
      select: { id: true, name: true, deadline: true, status: true },
    });

    return { serviceTypes: serviceTypes ?? [] };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
