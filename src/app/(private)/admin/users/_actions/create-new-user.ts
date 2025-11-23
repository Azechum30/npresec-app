"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { UserSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import Argon2, { argon2id } from "argon2";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { revalidatePath } from "next/cache";

export const createNewUserAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserWithPermissions("create:users");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = UserSchema.safeParse(values);

    if (!success || error) {
      const errMessage = error.errors.flatMap((e) => e.message).join(",");
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

    const hashedPassword = await Argon2.hash(data.password, {
      type: argon2id,
      memoryCost: 1024,
    });

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        roleId: data.role,
        resetPasswordRequired: true,
      },
    });

    if (!newUser) {
      return { error: "Failed to create new user" };
    }

    const emailConfig = {
      to: [data.email],
      username: data.username,
      data: {
        lastName: data.username,
        email: data.email,
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
