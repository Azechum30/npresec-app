/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { VerifyStudentSchema, type VerifyStudentType } from "@/lib/validation";
import "server-only";

export const getPlaceStudentByIndex = async (value: VerifyStudentType) =>
  nextSafeAction(async () => {
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

      if (!placedStudent)
        throw new ActionError(
          "Student ID not found",
          CUSTOM_ERRORS.NOTFOUND.status,
          CUSTOM_ERRORS.NOTFOUND.code,
        );

      return { placedStudent };
    }

    const student = await prisma.student.findUnique({
      where: { studentNumber: data.studentId },
      select: { id: true, studentNumber: true, isPaymentAccepted: true },
    });

    if (!student)
      throw new ActionError(
        "Student ID not found",
        CUSTOM_ERRORS.NOTFOUND.status,
        CUSTOM_ERRORS.NOTFOUND.code,
      );

    return { student };
  });
