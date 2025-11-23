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
    select: {
      id: true,
      username: true,
      email: true,
      picture: true,
      name: true,
      bio: true,
      subscribeToOurNewsLetter: true,
      xUrl: true,
      linkedInUrl: true,
      facebookUrl: true,
      instagramUrl: true,
      timezone: true,
      notificationFrequency: true,
      emailNotifications: true,
      itemsPerPage: true,
      theme: true,
      dateFormat: true,
      compactMode: true,
      showTips: true,
      role: {
        select: {
          name: true,
          id: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
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
