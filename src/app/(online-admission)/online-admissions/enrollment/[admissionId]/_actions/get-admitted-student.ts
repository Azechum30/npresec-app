"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { PlacementListSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import z from "zod";
export const getAdmittedStudent = async (admissionId: string) => {
  try {
    const { error, success, data } = z.string().safeParse(admissionId);

    if (!success) throw error;

    const student = await prisma.admission.findUnique({
      where: { id: admissionId },
      select: PlacementListSelect,
    });

    if (!student) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return { student };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
