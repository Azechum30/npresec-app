"use server";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { ActionError, Levels } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import { singleStudentType } from "@/lib/types";
import {
  StudentEnrollmentSchema,
  StudentEnrollmentType,
} from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";

export const updateAndCreateStudentRecord = async (
  values: StudentEnrollmentType,
) => {
  try {
    const { error, success, data } = StudentEnrollmentSchema.safeParse(values);

    if (!success) throw error;

    const {
      departmentId,
      classId,
      email,
      className,
      phone,
      guardianEmail,
      ...rest
    } = data;

    const [updated, role] = await Promise.all([
      prisma.admission.update({
        where: { jhsIndexNumber: data.jhsIndexNumber },
        data: {
          ...rest,
          isFormSubmitted: true,
          admissionStatus: "ADMITTED",
        },
      }),
      prisma.role.findFirst({
        where: { name: "student" },
        select: { id: true },
      }),
    ]);

    if (updated && role) {
      const body = {
        data: {
          birthDate: rest.birthDate,
          classId: classId,
          currentLevel: "Year_One" as (typeof Levels)[number],
          dateEnrolled: updated.createdAt,
          email: email
            ? email
            : `${updated.lastName}_${updated.jhsIndexNumber}@gmail.com`,
          firstName: updated.otherNames.split(" ")[0],
          gender: updated.gender,
          guardianName: updated.guardianName ?? "",
          guardianPhone: updated.guardianPhoneNumber ?? "",
          guardianRelation: updated.guardianRelation ?? "",
          lastName: updated.lastName,
          status: "Active",
          userId: updated.id,
          address: updated.primaryAddress,
          departmentId: departmentId,
          graduationDate: computeGraduationDate(updated.createdAt),
          guardianAddress: updated.primaryAddress,
          guardianEmail: guardianEmail,
          middleName: updated.otherNames.split(" ")[1],
          nationality: "Ghanaian",
          previousSchool: updated.jhsAttended,
          phone: phone,
          religion: "Christian",
          roleId: role.id,
        },
      } satisfies singleStudentType;

      const existingEmail = await prisma.user.findFirst({
        where: { email: body.data.email },
      });

      if (existingEmail)
        throw new ActionError(
          "The user the student email chosen already exist.",
        );

      await workflowClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/online-admission/onboard-student/onlineAdmissionStudentOnboardingWorkflow`,
        body: body,
      });
    }

    updateTag("placement-list");

    return { success: true, admissionId: updated.id };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
