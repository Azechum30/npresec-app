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
// import { ExtendedUser, getUserRoleName, UserRole } from "@/types/auth";
import { User } from "@/lib/auth";
import { getAuthRedirectPathWithLogging } from "@/utils/auth-redirects";
import { UserRole } from "@/auth-types";

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
        return { success: false, error: "duplicate email!" };
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

export const signInAction = async (data: SignInType, callbackUrl?: string) => {
  try {
    // 1. Validate input
    const validateData = SignInSchema.safeParse(data);

    if (!validateData.success) {
      const error = validateData.error.issues.flatMap(
        (e) => `${e.path[0]}: ${e.message}`,
      )[0];
      return { error };
    }

    const requestHeaders = await headers();

    await auth.api.signInEmail({
      body: {
        email: validateData.data.email,
        password: validateData.data.password,
      },
      headers: requestHeaders,
    });

    const user = await prisma.user.findUnique({
      where: {
        email: validateData.data.email.toLowerCase(),
      },
      include: {
        role: true,
        permissions: true,
      },
    });

    if (user) {
      const userRole = getUserRole(user as User);

      console.log("User signed in:", {
        userId: user.id,
        email: user.email,
        role: userRole,
        permissions: user.permissions?.length || 0,
      });

      // Use shared redirect logic
      const redirectPath = getAuthRedirectPathWithLogging({
        callbackUrl: callbackUrl,
        userRole: userRole,
        defaultFallback: "/profile",
      });
      return {
        success: true,
        user: user as User,
        role: userRole,
        redirectTo: redirectPath,
      };
    }

    return { error: "Sign in failed - no user returned" };
  } catch (error: any) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error) {
      const code = (error as any).code;
      if (code === "INVALID_CREDENTIALS" || code === "USER_NOT_FOUND") {
        return { error: "Invalid login credentials" };
      }
    }

    console.error("Sign-in error:", error);
    Sentry.captureException(error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(error.message)
          : "Something went wrong!",
    };
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

export const sendVerificationEmailAction = async (email: string) => {
  try {
    // Rate limit
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      return { error: "Too many requests. Please try again later!" };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: "If the email exists, verification email has been sent.",
      };
    }

    if (user.emailVerified) {
      return { error: "Email is already verified." };
    }

    // Use better-auth's built-in email verification
    await auth.api.sendVerificationEmail({
      body: { email: email.toLowerCase() },
      headers: await headers(),
    });

    return { success: true, message: "Verification email sent successfully!" };
  } catch (error) {
    console.error("Send verification email error:", error);
    Sentry.captureException(error);
    return { error: "Failed to send verification email." };
  }
};

const getUserRole = (user: User): UserRole => {
  return user?.role?.name as UserRole;
};
