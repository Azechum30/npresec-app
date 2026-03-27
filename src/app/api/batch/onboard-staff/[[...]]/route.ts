import { checkEntityExistencePossibleDuplicates } from "@/app/(private)/(admin)/admin/staff/utils/check-enity-existence-possible-duplicates";
import { validateAndTransformBulkData } from "@/app/(private)/(admin)/admin/staff/utils/validate-and-transform-bulk-data";
import { arcjetEmailProtection } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { sendMail } from "@/lib/resend-config";
import { env } from "@/lib/server-only-actions/validate-env";
import { BulkEmailType, RequestBodyType, UserWithIndexT } from "@/lib/types";
import { createUserCredentials } from "@/utils/create-user-credentials";
import { getEmailBatchConfig } from "@/utils/email-batch-config";

import { createWorkflow, serveMany } from "@upstash/workflow/nextjs";
import { revalidateTag } from "next/cache";

export const emailBatchWorkflow = createWorkflow<BulkEmailType, unknown>(
  async (context) => {
    const { emails, userId, source } = context.requestPayload;
    const channelName = `userId-${userId}`;
    const config = getEmailBatchConfig();
    let totalSuccessful = 0;

    for (let i = 0; i < emails.length; i += config.batchSize) {
      const batch = emails.slice(i, i + config.batchSize);

      const batchResult = await context.run(`send-batch-${i}`, async () => {
        try {
          const response = await sendMail(batch);
          if (response.error) throw new Error(response.error);
          return { successCount: batch.length };
        } catch (err) {
          const individualResults = await Promise.all(
            batch.map(async (emailData) => {
              try {
                const res = await sendMail(emailData);
                return !res.error;
              } catch {
                return false;
              }
            }),
          );
          return { successCount: individualResults.filter(Boolean).length };
        }
      });

      totalSuccessful += batchResult.successCount;

      if (i + config.batchSize < emails.length) {
        await context.sleep(`wait-${i}`, config.batchDelay / 1000);
      }
    }

    // Only notify at the very end
    await context.run("final-email-notification", async () => {
      await triggerServerNotification(
        channelName,
        `${source}-emails-sent-completed`,
        {
          message: `Email processing finished: ${totalSuccessful}/${emails.length} sent.`,
          type: "success",
        },
      );
    });
  },
);

const staffCreationWorkflow = createWorkflow<RequestBodyType, unknown>(
  async (context) => {
    const { rawData, userId, source } = context.requestPayload;
    const config = getEmailBatchConfig();
    let createdUsers = [] as UserWithIndexT[];
    const channelName = `userId-${userId}`;

    const { transformedData } = await context.run(
      "transform-data",
      async () => {
        const validData = validateAndTransformBulkData(rawData);
        const checkedData =
          await checkEntityExistencePossibleDuplicates(validData);

        return {
          transformedData: checkedData.transformedData.map(
            ({ password, ...rest }) => rest,
          ),
        };
      },
    );

    const validDataWithEmails = await context.run("arcjet-checks", async () => {
      const results = [];
      for (let i = 0; i < transformedData.length; i += 10) {
        const chunk = transformedData.slice(i, i + 10);
        const chunkResults = await Promise.all(
          chunk.map(async (data) => {
            const result = await arcjetEmailProtection(data.email, userId);
            return result.error ? null : data;
          }),
        );
        results.push(...chunkResults.filter((r) => r !== null));
      }
      return results;
    });

    const totalBatches = Math.ceil(
      validDataWithEmails.length / config.batchSize,
    );

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * config.batchSize;
      const chunk = validDataWithEmails.slice(start, start + config.batchSize);

      const batchResults = await context.run(
        `process-batch-${batchIndex}`,
        async () => {
          const results: UserWithIndexT[] = [];

          for (let idx = 0; idx < chunk.length; idx++) {
            const staffData = chunk[idx];
            const originalRecord = rawData.data.find(
              (d) => d.email === staffData.email,
            );

            if (!originalRecord) continue;
            try {
              const { user } = await createUserCredentials({
                email: staffData.email,
                username: staffData.username,
                password: originalRecord.password,
                roleId: staffData.roleId,
                lastName: staffData.lastName,
              });

              const { email, username, roleId, imageURL, ...rest } = staffData;
              await prisma.staff.upsert({
                where: { employeeId: rest.employeeId },
                update: {},
                create: {
                  ...rest,
                  departmentId: rest.departmentId,
                  birthDate: new Date(rest.birthDate),
                  courses: rest.courses
                    ? {
                        connect: rest.courses.map((cs) => ({ id: cs })),
                      }
                    : undefined,
                  classes: rest.classes
                    ? {
                        connect: rest.classes.map((cls) => ({ id: cls })),
                      }
                    : undefined,
                  dateOfFirstAppointment: rest.dateOfFirstAppointment
                    ? new Date(rest.dateOfFirstAppointment)
                    : undefined,
                  userId: user.id,
                },
              });

              results.push({
                user: {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                },
                originalIndex: rawData.data.indexOf(originalRecord),
              });
            } catch (err) {
              console.error(`Failed to process ${staffData.email}:`, err);
            }
          }
          return results;
        },
      );
      createdUsers.push(...batchResults);
    }

    if (createdUsers.length > 0) {
      await context.invoke("send-staff-emails", {
        workflow: emailBatchWorkflow,
        body: {
          userId,
          source,
          emails: createdUsers.map(({ user, originalIndex }) => ({
            to: [user.email],
            username: user.username,
            data: {
              lastName: rawData.data[originalIndex].lastName,
              email: user.email,
              password: rawData.data[originalIndex].password,
            },
          })),
        },
      });
    }

    await context.run("final-cleanup", async () => {
      revalidateTag("staff", "seconds");
      revalidateTag("users-list", "seconds");
      await triggerServerNotification(
        channelName,
        "staff-bulk-creation-success",
        {
          message: `Successfully onboarded ${createdUsers.length} staff members.`,
          type: "success",
        },
      );
    });
  },
);

export const { POST } = serveMany(
  { emailBatchWorkflow, staffCreationWorkflow },
  {
    baseUrl: env.UPSTASH_WORKFLOW_URL,
    verbose: false,
    failureFunction: async ({ context, failResponse }) => {
      const payload = context.requestPayload as any;
      const channelName = `userId-${payload.userId}`;

      const isStaffWorkflow = "rawData" in payload;

      if (isStaffWorkflow) {
        try {
          const { rawData } = payload;
          const emails = rawData.data.map((d: any) => d.email);

          const orphanedUsers = await prisma.user.findMany({
            where: {
              email: { in: emails },
              staff: { is: null },
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

      await triggerServerNotification(channelName, `workflow-failed`, {
        message: isStaffWorkflow
          ? "Bulk onboarding failed. Orphaned accounts were automatically rolled back"
          : "Failed to send emails. Please check dashboard.",
        type: "error",
      });

      console.error("An error occured: " + failResponse);
    },
  },
);
