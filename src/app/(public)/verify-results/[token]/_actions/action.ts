/** biome-ignore-all assist/source/organizeImports: reason */
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { verifyResultsVerificationToken } from "@/lib/jwt";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { StudentSelect, type VerifyStudentsParams } from "@/lib/types";
import z from "zod";

const verifyStudentResultsSchema = z.object({
  token: z.string(),
});

export const verifyStudentResults = async (values: VerifyStudentsParams) =>
  nextSafeAction(async () => {
    const result = verifyStudentResultsSchema.safeParse(values);

    if (!result.success) throw result.error;

    const decoded = verifyResultsVerificationToken(result.data.token);

    if (!decoded)
      throw new ActionError("Result verification token has expired");

    const semesterSummaries = await prisma.semesterSummary.findUnique({
      where: {
        studentId_academicYear_semester: {
          studentId: decoded.sub,
          semester: decoded.sem,
          academicYear: decoded.year,
        },
      },
      include: {
        student: {
          select: StudentSelect,
        },
      },
    });

    if (semesterSummaries === null)
      throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return semesterSummaries;
  });
