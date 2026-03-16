"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { triggerSendEmail } from "@/lib/trigger-send-email";
import { UserSchema } from "@/lib/validation";
import { createUserCredentials } from "@/utils/create-user-credentials";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import "server-only";

export const createNewUserAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:users");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = UserSchema.safeParse(values);

    if (!success || error) {
      const errMessage = error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join(",");
      return { error: errMessage };
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

    if (user) {
      const emailConfig = {
        to: [user.email],
        username: user.username,
        data: {
          lastName: user.username,
          email: user.email,
          password: data.password,
        },
      };

      void triggerSendEmail(emailConfig);
    }

    void revalidateTag("users-list", "seconds");

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
