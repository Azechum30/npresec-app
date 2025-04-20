import { getSession } from "./get-user";
import { prisma } from "./prisma";

export async function getAuthUser() {
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
