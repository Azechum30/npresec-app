"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { VerifyStudentSchema, VerifyStudentType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getPlaceStudentByIndex = async (
  value: VerifyStudentType,
): Promise<{
  placedStudent?: {
    jhsIndexNumber: string;
    id: string;
    isAcceptancePaid: boolean;
    isFormSubmitted: boolean;
  };
  student?: {
    id: string;
    studentNumber: string;
    isPaymentAccepted: boolean | null;
  };
  error?: string;
}> => {
  try {
    const { success, data, error } = VerifyStudentSchema.safeParse(value);

    if (!success) throw error;

    if (data?.serviceName?.toLowerCase().includes("admission")) {
      const placedStudent = await prisma.admission.findUnique({
        where: {
          jhsIndexNumber: data.studentId,
        },
        select: {
          jhsIndexNumber: true,
          id: true,
          isAcceptancePaid: true,
          isFormSubmitted: true,
        },
      });

      if (!placedStudent) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

      return { placedStudent };
    }

    const student = await prisma.student.findUnique({
      where: { studentNumber: data.studentId },
      select: { id: true, studentNumber: true, isPaymentAccepted: true },
    });

    if (!student) {
      throw new ActionError("Student ID does not exist");
    }

    return { student };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
