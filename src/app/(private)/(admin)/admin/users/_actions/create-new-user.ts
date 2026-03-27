"use server";
import { arcjetEmailProtection } from "@/lib/arcjet";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { triggerSendEmail } from "@/lib/trigger-send-email";
import { UserSchema } from "@/lib/validation";
import { createUserCredentials } from "@/utils/create-user-credentials";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import "server-only";

export const createNewUserAction = async (values: unknown) => {
  try {
    const { user: authUser, hasPermission } =
      await getUserPermissions("create:users");

    if (!authUser || !hasPermission) return { error: "Permission denied" };

    const { error, success, data } = UserSchema.safeParse(values);

    if (!success || error) {
      const errMessage = error.issues
        .flatMap((e) => `${e.path[0] as any}: ${e.message}`)
        .join(",");
      return { error: errMessage };
    }

    const result = await arcjetEmailProtection(
      data.email.trim().toLowerCase(),
      authUser.id,
    );

    if (result.error) {
      return { error: result.error };
    }

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
      return { error: "Email is already taken" };
    }

    if (existingUser?.username === data.username) {
      return { error: "Username is already taken!" };
    }

    const { user } = await createUserCredentials({
      email: data.email.trim().toLowerCase(),
      username: data.username,
      lastName: data.username,
      password: data.password,
      roleId: data.role,
    });

    if (!user) {
      await prisma.user.delete({
        where: { email: data.email },
      });
    }

    after(async () => {
      try {
        if (user) {
          const emailConfig = {
            userId: authUser.id,
            source: "users",
            to: [user.email],
            username: user.username,
            data: {
              lastName: user.username,
              email: user.email,
              password: data.password,
            },
          };

          await triggerSendEmail(emailConfig);
        }
        await triggerServerNotification(
          `userId-${authUser.id}`,
          "user-onboarding-email-queued",
          {
            message: `Onboarding email message to ${user.email} was successfully queued.`,
            type: "success",
          },
        );

        revalidateTag("users-list", "seconds");
      } catch (bgError) {
        console.error("Failed to queue user onboarding email.", bgError);
        Sentry.captureException(bgError);
        await triggerServerNotification(
          `userId-${authUser.id}`,
          "Onboarding-email-queue-error",
          {
            message:
              "Failed to queue onboarding email message to " + user.email,
            type: "error",
          },
        );
      }
    });

    return { success: true };
  } catch (e) {
    console.error("Failed to create user", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong! Please try again",
    };
  }
};
