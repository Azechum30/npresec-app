"use server";
import "server-only";
import { prisma } from "../prisma";
import argon2 from "argon2";
import { lucia } from "../lucia";
import { cookies } from "next/headers";
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
import { getSession } from "../get-user";
import { generateToken, verifyToken } from "../jwt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

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

    const hashedPassowrd = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email.toLowerCase(),
        password: hashedPassowrd,
        resetPasswordRequired: false,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/admin/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { success: false, error: "Something went wrong!" };
  }
};

export const signInAction = async (
  data: SignInType
): Promise<{
  error?: string;
  resetPasswordRequired?: boolean;
  resetToken?: string;
}> => {
  try {
    const { email, password } = SignInSchema.parse(data);
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        role: true,
      },
    });

    if (!user || !user.password) {
      return { error: "Invalid login credentials" };
    }

    const matchedPassword = await argon2.verify(
      user.password as string,
      password
    );

    if (!matchedPassword) return { error: "Invalid login credentials" };

    if (user.resetPasswordRequired) {
      const resetToken = generateToken(user.id);
      return { resetPasswordRequired: true, resetToken };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    if (user.role?.name === "admin") {
      return redirect("/admin/dashboard");
    }

    if (user.role?.name === "teacher") {
      return redirect("/teachers");
    }

    return redirect("/students");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const logOut = async () => {
  const { session } = await getSession();

  if (session?.id) {
    await lucia.invalidateSession(session.id as string);

    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  return { success: true };
};

export const resetPasswordAction = async (values: ResetPasswordType) => {
  try {
    const validData = ResetPasswordSchema.safeParse(values);
    let zodErrors = {};
    if (!validData.success) {
      validData.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
      });
    }

    if (Object.keys(zodErrors).length > 0) {
      return { errors: zodErrors };
    }

    if (!validData.data?.token) {
      return { error: "Token is required!" };
    }

    const userId = verifyToken(validData.data.token);

    if (!userId) {
      return { error: "Invalid token or token has expired!" };
    }

    const hashedPassowrd = await argon2.hash(
      validData.data?.password as string
    );

    const updatedPasswordUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassowrd,
        resetPasswordRequired: false,
      },
    });

    if (!updatedPasswordUser) {
      return { error: "User not found!" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        error: "Supplied token has expired. Kindly request a new reset link",
      };
    } else if (error instanceof JsonWebTokenError) {
      return { error: "Invalid token. Please request reset link" };
    } else {
      console.error("Something an error occured in resetPasswordAction", error);
      return { error: "something went wrong!" };
    }
  }
};
