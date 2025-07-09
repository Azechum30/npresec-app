import { cache } from "react";
import { getSession } from "./get-user";
import { prisma } from "./prisma";
async function getUser() {
  const { user } = await getSession();

  if (!user) {
    return null;
  }

  const userWithRelations = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      role: {
        select: {
          name: true,
          id: true,
          permissions: true,
        },
      },
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return userWithRelations;
}

export const getAuthUser = cache(getUser);
