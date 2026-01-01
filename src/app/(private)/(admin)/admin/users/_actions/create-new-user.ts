"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserPermissions } from "@/lib/get-session";
import { UserSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    await auth.api.signUpEmail({
      body: {
        email: data.email.trim().toLowerCase(),
        username: data.username,
        name: data.username,
        password: data.password,
        callbackURL: "/email-verified",
      },
      headers: await headers(),
    });

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: data.email.trim().toLowerCase() },
        select: { id: true },
      });
      if (!user) throw new Error("Failed to create user");

      return await tx.user.update({
        where: { id: user.id },
        data: { roleId: data.role },
      });
    });

    const emailConfig = {
      to: [createdUser.email],
      username: createdUser.username,
      data: {
        lastName: createdUser.username,
        email: createdUser.email,
        password: data.password,
      },
    };

    await client.publishJSON({
      url: `${env.NEXT_PUBLIC_URL}/api/send/emails`,
      body: emailConfig,
    });

    revalidatePath("/admin/users");

    return { success: true };
  } catch (e) {
    console.error("Failed to create user", e);
    Sentry.captureException(e);
    return { error: "Something went wrong! Please try again" };
  }
};
