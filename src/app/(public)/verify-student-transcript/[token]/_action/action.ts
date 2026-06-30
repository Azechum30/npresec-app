"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { verifyResultsVerificationToken } from "@/lib/jwt";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { StudentSelect, type VerifyStudentsParams } from "@/lib/types";
import "server-only";
import z from "zod";

export const verifyStudentTranscipt = async (values: VerifyStudentsParams) =>
  nextSafeAction(async () => {
    const result = z.object({ token: z.string() }).safeParse(values);
    if (!result.success) throw result.error;

    const { token } = result.data;

    const decoded = verifyResultsVerificationToken(token);

    if (!decoded)
      throw new ActionError(
        "student transcript verification token has expired ",
      );

    const summary = await prisma.semesterSummary.findFirst({
      where: { studentId: decoded.sub },
      orderBy: [{ semester: "desc" }, { academicYear: "desc" }],
      include: { student: { select: StudentSelect } },
    });

    if (!summary) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return summary;
  });
