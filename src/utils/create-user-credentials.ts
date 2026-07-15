/** biome-ignore-all assist/source/organizeImports: reason */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const createUserCredentials = async ({
  email,
  username,
  lastName,
  password,
  roleId,
}: {
  email: string;
  username?: string;
  lastName: string;
  password?: string;
  roleId: string;
}) => {
  const generatedUsername = username || email.split("@")[0];

  const generatedPassword = password || `${lastName.toLowerCase()}@1234`;

  const { user, token } = await auth.api.signUpEmail({
    body: {
      email,
      username: generatedUsername,
      password: generatedPassword,
      name: generatedUsername,
      callbackURL: "/email-verified",
    },
    headers: await headers(),
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  const createdUser = await prisma.$transaction(async (tx) => {
    const userRole = await tx.role.findUniqueOrThrow({
      where: { id: roleId },
      select: { id: true, name: true },
    });
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        role: userRole.name,
        roles: {
          create: {
            role: {
              connect: { id: userRole.id },
            },
          },
        },
      },
    });
  });

  return { user: createdUser, token };
};
