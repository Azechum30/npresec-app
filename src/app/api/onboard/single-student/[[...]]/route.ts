import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { sendMail } from "@/lib/resend-config";
import { env } from "@/lib/server-only-actions/validate-env";
import { SingleEmailType, singleStudentType } from "@/lib/types";
import { status } from "@/lib/validation";
import { createUserCredentials } from "@/utils/create-user-credentials";
import {
  CONSTANTS,
  Department,
  generateStudentIndex,
  gradelevels,
} from "@/utils/generateStudentIndex";
import { triggerRollback } from "@/utils/trigger-better-auth-user-delete";
import { createWorkflow, serveMany } from "@upstash/workflow/dist/nextjs";
import { revalidateTag } from "next/cache";

export const singleStudentEmailWorkflow = createWorkflow<
  SingleEmailType,
  unknown
>(async (context) => {
  const { emailData, source, userId } = context.requestPayload;
  const channelName = `userId-${userId}`;

  await context.run("single-student-email-workflow", async () => {
    try {
      const res = await sendMail(emailData);

      if (res.error) {
        throw new Error("Could not send student email");
      }
      await triggerServerNotification(
        channelName,
        "single-student-email-success",
        {
          message: "Student email successfully sent",
          type: "success",
        },
      );
    } catch (e) {
      console.error("Failed to sent student email", e);
      await triggerServerNotification(
        channelName,
        "single-student-email-error",
        {
          message: "Could not send student email",
          type: "error",
        },
      );
    }
  });
});

const singleStudentCreationWorkflow = createWorkflow<
  singleStudentType,
  unknown
>(async (context) => {
  const { data } = context.requestPayload;
  const password = generatePassword();
  const admissionYear = new Date(data.dateEnrolled).getFullYear();
  const random = Math.floor(Math.random() * 1000);
  const channelName = `userId-${data.userId}`;

  const authUser = await context.run(
    "create-student-crendentials",
    async () => {
      const { user } = await createUserCredentials({
        email: data.email,
        password,
        username: `${data.firstName}${random}`,
        lastName: data.lastName,
        roleId: data.roleId,
      });

      if (!user) {
        throw new Error("Failed to create student credentials");
      }

      return user;
    },
  );

  const created = await context.run("onboard-student", async () => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const latestStudent = await tx.student.findFirst({
          where: {
            departmentId: data.departmentId,
            dateEnrolled: {
              gte: new Date(admissionYear, 0, 1),
              lt: new Date(admissionYear + 1, 0, 1),
            },
          },
          orderBy: { studentNumber: "desc" },
          select: { studentNumber: true },
        });

        const sequence = latestStudent
          ? (parseInt(
              latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
            ) || 0) + 1
          : 1;

        const studentID = generateStudentIndex({
          department: (
            await tx.department.findUnique({
              where: { id: data.departmentId as string },
              select: { name: true },
            })
          )?.name as Department,
          admissionYear,
          sequenceNumber: sequence,
        });

        const { classId, departmentId, email, userId, roleId, ...rest } = data;
        // Create Student and Connect User
        const createdStudent = await tx.student.create({
          data: {
            ...rest,
            studentNumber: studentID,
            currentLevel: rest.currentLevel as (typeof gradelevels)[number],
            status: rest.status as (typeof status)[number],
            graduationDate: computeGraduationDate(rest.dateEnrolled),
            currentClass: { connect: { id: classId as string } },
            department: { connect: { id: departmentId as string } },
            user: { connect: { id: authUser.id } },
          },
        });

        classId &&
          (await tx.class.update({
            where: { id: classId },
            data: { currentEnrollment: { increment: 1 } },
          }));

        return createdStudent;
      });

      return result;
    } catch (e) {
      console.error("failed to onboard student");
      await triggerRollback(authUser.id as string);
    }
  });

  await context.run("final-student-cleanup", async () => {
    revalidateTag("users-list", "seconds");
    revalidateTag("students-list", "seconds");

    await triggerServerNotification(
      channelName,
      "single-student-onboard-success",
      {
        message: "student onboarding successful",
        type: "success",
      },
    );
  });
  await context.invoke("send-student-email", {
    workflow: singleStudentEmailWorkflow,
    body: {
      emailData: {
        to: [authUser.email],
        username: `${data.firstName} ${data.lastName}`,
        data: {
          lastName: data.lastName,
          password: password,
          email: authUser.email,
        },
      },
      userId: data.userId,
      source: "student",
    },
  });
});

export const { POST } = serveMany(
  {
    singleStudentCreationWorkflow,
    singleStudentEmailWorkflow,
  },
  {
    baseUrl: `${env.UPSTASH_WORKFLOW_URL}`,
    failureFunction: async ({ context }) => {
      const payload = context.requestPayload as singleStudentType;
      const userEmail = payload.data.email;
      const channelName = `userId-${payload.data.userId}`;

      try {
        const orphanUser = await prisma.user.findUnique({
          where: { email: userEmail, student: { is: null } },
          select: { id: true },
        });

        if (orphanUser) {
          await prisma.user.delete({
            where: { id: orphanUser.id },
          });

          console.log(`Rollback: Deleted orphan user ${userEmail}`);
        }

        await triggerServerNotification(
          channelName,
          "single-student-workflow-failed",
          {
            message: "Onboarding failed. Security cleanup completed.",
            type: "error",
          },
        );
      } catch (err) {
        console.error("Critical: Rollback failed during failureFunction", err);
      }
    },
  },
);
