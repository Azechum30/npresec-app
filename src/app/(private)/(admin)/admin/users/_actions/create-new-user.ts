/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { arcjetEmailProtection } from "@/lib/arcjet";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import type { SingleEmailType } from "@/lib/types";
import { UserSchema } from "@/lib/validation";
import { createUserCredentials } from "@/utils/create-user-credentials";
import "server-only";

export const createNewUserAction = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const { user: authUser } = await getUserPermissions("create:users");

      if (!authUser)
        throw new ActionError(CUSTOM_ERRORS.AUTHENTICATION.message);

      const { error, success, data } = UserSchema.safeParse(values);

      if (!success) throw error;

      const result = await arcjetEmailProtection(
        data.email.trim().toLowerCase(),
        authUser.id,
      );

      if (result.error) throw new ActionError(result.error);

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: data.email } },
            { username: { equals: data.username } },
          ],
        },
        select: {
          username: true,
          email: true,
        },
      });

      if (existingUser?.email === data.email) {
        throw new ActionError("Email is already taken");
      }

      if (existingUser?.username === data.username) {
        throw new ActionError("Username is already taken!");
      }

      const { user } = await createUserCredentials({
        email: data.email.trim().toLowerCase(),
        username: data.username,
        lastName: data.username,
        password: data.password,
        roleId: data.role,
      });

      const emailConfig = {
        userId: authUser.id,
        source: "users",
        emailData: {
          to: [user.email],
          username: user.username,
          data: {
            lastName: user.username,
            email: user.email,
            password: data.password,
          },
        },
      } satisfies SingleEmailType;

      const workFlowUrl = `${env.UPSTASH_WORKFLOW_URL}/api/onboard/single-student/singleStudentEmailWorkflow`;

      await workflowClient.trigger({
        url: workFlowUrl,
        body: emailConfig,
      });

      return { success: true };
    },
    { permission: "create:users" },
  );
