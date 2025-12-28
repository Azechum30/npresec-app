"use server";
import "server-only";
import { prisma } from "../prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  SignUpType,
  SignUpSchema,
  SignInType,
  SignInSchema,
  ResetPasswordType,
  ResetPasswordSchema,
} from "../validation";
import * as Sentry from "@sentry/nextjs";
import { rateLimit } from "@/utils/rateLimit";
import { auth } from "@/lib/auth";
import { env } from "./validate-env";

export const signUpAction = async (data: SignUpType) => {
  try {
    const { username, email, password } = SignUpSchema.parse(data);

    const [existingUser, role] = await prisma.$transaction([
      prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() },
          ],
        },
      }),
      prisma.role.findUnique({
        where: { name: "admin" },
      }),
    ]);

    if (existingUser?.email) {
      return { success: false, error: "Email is already taken!" };
    }

    if (existingUser?.username) {
      return { success: false, error: "Username already taken!" };
    }

    if (!role) {
      return { success: false, error: "Role not found!" };
    }

    // Sign up with Better-auth
    // Better-auth handles password hashing and session creation automatically
    // Since username is required in additionalFields, it must be included in the body
    await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password,
        name: username, // Better-auth's default name field
        username: username, // Required custom field from additionalFields
      } as {
        email: string;
        password: string;
        name: string;
        username: string;
      },
      headers: await import("next/headers").then((m) => m.headers()),
    });

    // Get the created user to update with custom fields
    const createdUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!createdUser) {
      return { success: false, error: "Failed to create user" };
    }

    // Update user with custom fields (username, roleId, resetPasswordRequired)
    await prisma.user.update({
      where: { id: createdUser.id },
      data: {
        username: username,
        roleId: role.id,
      },
    });

    return redirect("/admin/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // Better-auth throws errors for validation failures
    if (error instanceof Error) {
      // Check for common Better-auth error messages
      if (
        error.message.includes("email") ||
        error.message.includes("Email") ||
        error.message.includes("already exists") ||
        error.message.includes("duplicate")
      ) {
        return { success: false, error: "Email is already taken!" };
      }
      if (
        error.message.includes("password") ||
        error.message.includes("Password")
      ) {
        return { success: false, error: "Invalid password format" };
      }
    }

    console.error("Sign-up error:", error);
    Sentry.captureException(error);
    return { success: false, error: "Something went wrong!" };
  }
};

export const signInAction = async (data: SignInType) => {
  try {
    // 1. Validate input
    const { email, password } = SignInSchema.parse(data);
    const normalizedEmail = email.toLowerCase();

    // 2. Look up user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { role: true, accounts: true },
    });

    if (!user) {
      return { error: "Invalid login credentials" };
    }

    const account =
      user?.accounts.find((account) => account.providerId === "credential") ??
      null;

    if (account) {
      await auth.api.requestPasswordReset({
        body: {
          email: normalizedEmail,
          redirectTo: `${env.NEXT_PUBLIC_URL}/reset-password`,
        },
      });
      return { resetPasswordRequired: true };
    }

    // 4. Attempt sign-in via Better Auth
    const { user: signedInUser } = await auth.api.signInEmail({
      body: { email: normalizedEmail, password },
      headers: await headers(),
    });

    if (!signedInUser) {
      return { error: "Failed to created session" };
    }

    const authuser = await prisma.user.findUnique({
      where: { id: signedInUser.id },
      include: { role: true },
    });
    switch (authuser?.role?.name) {
      case "admin":
        return redirect("/admin/dashboard");
      case "teacher":
        return redirect("/teachers");
      default:
        return redirect("/students");
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // 7. Handle Better Auth errors more robustly
    if (error instanceof Error) {
      // Better Auth errors often have a `code` property
      const code = (error as any).code;
      if (code === "INVALID_CREDENTIALS" || code === "USER_NOT_FOUND") {
        return { error: "Invalid login credentials" };
      }
    }

    console.error("Sign-in error:", error);
    Sentry.captureException(error);
    return { error: "Something went wrong!" };
  }
};

export const getUserRole = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "No active session" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return {
      role: user.role?.name || "student",
      userId: user.id,
    };
  } catch (error) {
    console.error("Failed to get user role:", error);
    return { error: "Failed to get user role" };
  }
};

export const resetPasswordAction = async (values: ResetPasswordType) => {
  try {
    // 1. Rate limit
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return { error: "Too many requests. Please try again later!" };
    }

    // 2. Validate input
    const parsed = ResetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    const { password, token } = parsed.data;
    if (!token) {
      return { error: "Token is required!" };
    }

    // 3. Reset password via Better Auth
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    // 5. Error handling
    if (
      (error as any).code === "INVALID_TOKEN" ||
      (error as any).code === "TOKEN_EXPIRED"
    ) {
      return {
        error:
          "Invalid token or token has expired. Please request a new reset link.",
      };
    }
    if ((error as any).code === "INVALID_PASSWORD") {
      return { error: "Invalid password format or requirements not met." };
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("token") ||
        msg.includes("expired") ||
        msg.includes("invalid")
      ) {
        return {
          error:
            "Invalid token or token has expired. Please request a new reset link.",
        };
      }
      if (msg.includes("password")) {
        return { error: "Invalid password format or requirements not met." };
      }
    }

    Sentry.captureException(error);
    console.error("An error occurred in resetting your password:", error);
    return { error: "Something went wrong!" };
  }
};
