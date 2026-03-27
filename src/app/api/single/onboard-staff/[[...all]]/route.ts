import { triggerStaffCreation } from "@/app/(private)/(admin)/admin/staff/utils/trigger-staff-creation";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { sendMail } from "@/lib/resend-config";
import { env } from "@/lib/server-only-actions/validate-env";
import { SingleEmailType, SingleStaffCreationType } from "@/lib/types";
import { createUserCredentials } from "@/utils/create-user-credentials";
import { transformAndValidateStaffData } from "@/utils/staff-data-transformer";
import { WorkflowNonRetryableError } from "@upstash/workflow";
import { createWorkflow, serveMany } from "@upstash/workflow/nextjs";
import { revalidateTag } from "next/cache";

const singleEmailWorkflow = createWorkflow<SingleEmailType, unknown>(
  async (context) => {
    const { emailData, userId, source } = context.requestPayload;

    const channelName = `userId-${userId}`;

    await context.run(`process-${source}-email`, async () => {
      const result = await sendMail(emailData);

      if (result.error) {
        throw new Error(`Resend error ${result.error}`);
      }
    });

    await context.run(`${source}-onboaring-complete`, async () => {
      await triggerServerNotification(
        channelName,
        `${source}-onboarding-email-sent`,
        {
          message: `Onboarding email was successfully sent to ${emailData.to[0]}`,
          type: "success",
        },
      );
    });
  },
);

const singleStaffCreationWorkflow = createWorkflow<
  SingleStaffCreationType,
  unknown
>(async (context) => {
  const { rawData, userId, source, roleId } = context.requestPayload;
  const channelName = `userId-${userId}`;

  const password = generatePassword();

  const transformedData = await context.run("data-transform", async () => {
    const { password, ...rest } = transformAndValidateStaffData(rawData);

    return rest;
  });

  const createdUser = await context.run(
    "create-login-credentials",
    async () => {
      const [existingEmail, existingUserName] = await Promise.all([
        prisma.user.findUnique({
          where: { email: transformedData.email },
        }),

        prisma.user.findUnique({
          where: { username: transformedData.username },
        }),
      ]);
      if (existingEmail) {
        throw new WorkflowNonRetryableError("The email already exist");
      }

      if (existingUserName) {
        throw new WorkflowNonRetryableError("staff username already exist");
      }

      if (!roleId) {
        throw new WorkflowNonRetryableError("A role Id is required");
      }
      const { user } = await createUserCredentials({
        email: transformedData.email,
        username: transformedData.username,
        password,
        lastName: transformedData.lastName,
        roleId: roleId,
      });

      return { id: user.id, email: user.email, username: user.username };
    },
  );

  const { staff } = await context.run("create-staff-details", async () => {
    const { username, email, imageFile, imageURL, ...rest } = transformedData;
    return triggerStaffCreation(createdUser.id, {
      ...rest,
      birthDate: new Date(rest.birthDate),
      dateOfFirstAppointment: rest.dateOfFirstAppointment
        ? new Date(rest.dateOfFirstAppointment)
        : undefined,
    });
  });

  if (staff) {
    await context.invoke(`send-staff-email`, {
      workflow: singleEmailWorkflow,
      body: {
        emailData: {
          to: [createdUser.email],
          username: createdUser.username,
          data: {
            lastName: transformedData.lastName,
            password,
            email: createdUser.email,
          },
        },
        userId,
        source,
      },
    });
  }

  await context.run("final-workflow-cleanup", async () => {
    revalidateTag("staff", "seconds");

    await triggerServerNotification(channelName, "staff-onboarding-success", {
      message: `staff with email ${createdUser.email} has been successfully onboarded`,
      type: "success",
    });
  });
});

export const { POST } = serveMany(
  {
    singleEmailWorkflow,
    singleStaffCreationWorkflow,
  },
  {
    baseUrl: env.UPSTASH_WORKFLOW_URL,
    failureFunction: async ({ context, failStatus, failResponse }) => {
      const payload = context.requestPayload as any;
      const channelName = `userId-${payload.userId}`;
      const isStaffWorkflow = "rawData" in payload;

      if (isStaffWorkflow) {
        try {
          const targetEmail = payload.rawData.email;

          const orphanedUser = await prisma.user.findUnique({
            where: { email: targetEmail, staff: { is: null } },
          });

          if (orphanedUser) {
            await prisma.user.delete({ where: { id: orphanedUser.id } });
            console.log(`Cleanup: Deleted orphaned user ${targetEmail}`);
          }
          revalidateTag("users-list", "seconds");
        } catch (e) {
          console.error("Compensation cleanup failed:", e);
        }
      }

      const errorMessage =
        typeof failResponse === "string"
          ? failResponse
          : "Internal workflow error";

      await triggerServerNotification(channelName, "workflow-failed", {
        message: isStaffWorkflow
          ? `Onboarding for ${payload.rawData.email} failed. ${errorMessage}`
          : "Email delivery failed after multiple retries.",
        type: "error",
      });
    },
  },
);
