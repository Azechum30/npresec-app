import { emailBatchWorkflow } from "@/app/api/batch/onboard-staff/[[...all]]/route";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { env } from "@/lib/server-only-actions/validate-env";
import { BulkStudentOnboardingType, UserWithIndexT } from "@/lib/types";
import { createUserCredentials } from "@/utils/create-user-credentials";
import { getEmailBatchConfig } from "@/utils/email-batch-config";
import {
  Department,
  generateStudentIndex,
  gradelevels,
} from "@/utils/generateStudentIndex";
import { createWorkflow, serveMany } from "@upstash/workflow/dist/nextjs";
import { revalidateTag } from "next/cache";

const studentsOnboardingWorkflow = createWorkflow<
  BulkStudentOnboardingType,
  unknown
>(async (context) => {
  const { userId, data } = context.requestPayload;
  const config = getEmailBatchConfig();
  let createdUsers = [] as UserWithIndexT[];
  const channelName = `userId-${userId}`;

  const totalBatches = Math.ceil(data.length / config.batchSize);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * config.batchSize;
    const chunk = data.slice(start, start + config.batchSize);

    const batchResults = await context.run(
      `process-batch-${batchIndex}`,
      async () => {
        const results: UserWithIndexT[] = [];

        for (let idx = 0; idx < chunk.length; idx++) {
          const studentData = chunk[idx];
          const password = studentData.password;
          const originalRecord = data.find(
            (d) => d.email === studentData.email,
          );

          if (!originalRecord) continue;
          try {
            const { user } = await createUserCredentials({
              email: studentData.email,
              username: `${studentData.firstName} ${Math.floor(Math.random() * 1000)}`,
              password: originalRecord.password,
              roleId: studentData.roleId,
              lastName: studentData.lastName,
            });

            await prisma.$transaction(async (tsx) => {
              const admissionYear = new Date(
                studentData.dateEnrolled,
              ).getFullYear();
              const latest = await tsx.student.findFirst({
                where: {
                  departmentId: studentData.departmentId?.id,
                  dateEnrolled: { gte: new Date(admissionYear, 0, 1) },
                },
                orderBy: { studentNumber: "desc" },
                select: { studentNumber: true },
              });

              const seq = latest
                ? (parseInt(latest.studentNumber.slice(-3)) || 0) + 1
                : 1;
              const studentID = generateStudentIndex({
                admissionYear,
                department: studentData.departmentId?.name as Department,
                sequenceNumber: seq,
              });

              const {
                classId,
                email,
                departmentId,
                roleId,
                password,
                ...rest
              } = studentData;

              await tsx.student.create({
                data: {
                  ...rest,
                  studentNumber: studentID,
                  birthDate: new Date(rest.birthDate),
                  dateEnrolled: new Date(rest.dateEnrolled),
                  userId: user.id,
                  classId: studentData.classId?.id,
                  departmentId: studentData.departmentId?.id,
                  currentLevel:
                    rest.currentLevel as (typeof gradelevels)[number],
                  graduationDate: rest.graduationDate
                    ? new Date(rest.graduationDate)
                    : computeGraduationDate(rest.dateEnrolled),
                },
              });

              await tsx.class.update({
                where: { id: studentData.classId?.id },
                data: { currentEnrollment: { increment: 1 } },
              });
            });
            results.push({
              user: {
                id: user.id,
                email: user.email,
                username: studentData.lastName,
                password,
              },
              originalIndex: data.indexOf(originalRecord),
            });
          } catch (err) {
            console.error(`Failed to process ${studentData.email}:`, err);
          }
        }
        return results;
      },
    );
    createdUsers.push(...batchResults);
  }
  if (createdUsers.length > 0) {
    await context.invoke("send-student-emails", {
      workflow: emailBatchWorkflow,
      body: {
        userId,
        source: "students",
        emails: createdUsers.map(({ user }) => ({
          to: [user.email],
          username: user.username,
          data: {
            lastName: user.username,
            email: user.email,
            password: user.password as string,
          },
        })),
      },
    });
  }

  await context.run("final-students-onboarding-cleanup", async () => {
    revalidateTag("students-list", "seconds");
    revalidateTag("users-list", "seconds");
    await triggerServerNotification(
      channelName,
      "student-bulk-creation-success",
      {
        message: `Successfully onboarded ${createdUsers.length} students.`,
        type: "success",
      },
    );
  });
});

export const { POST } = serveMany(
  { emailBatchWorkflow, studentsOnboardingWorkflow },
  {
    baseUrl: env.UPSTASH_WORKFLOW_URL,
    verbose: false,
    failureFunction: async ({ context, failResponse }) => {
      const payload = context.requestPayload as BulkStudentOnboardingType;
      const channelName = `userId-${payload.userId}`;

      const isStudentWorkflow = payload.data;

      if (isStudentWorkflow) {
        try {
          const { data } = payload;
          const emails = data.map((d) => d.email);

          const orphanedUsers = await prisma.user.findMany({
            where: {
              email: { in: emails },
              student: { is: null },
              createdAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
            },
            select: { id: true },
          });

          if (orphanedUsers) {
            await prisma.user.deleteMany({
              where: { id: { in: orphanedUsers.map((u) => u.id) } },
            });
          }

          revalidateTag("users-list", "seconds");
        } catch (e) {
          console.error("Cleanup failed");
        }
      }

      await triggerServerNotification(
        channelName,
        `bulk-student-workflow-failed`,
        {
          message: isStudentWorkflow
            ? "Bulk onboarding failed. Orphaned accounts were automatically rolled back"
            : "Failed to send emails. Please check dashboard.",
          type: "error",
        },
      );

      console.error("An error occured: " + failResponse);
    },
  },
);
