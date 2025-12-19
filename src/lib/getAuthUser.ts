import { cache } from "react";
import { getSession } from "./get-session";
import { prisma } from "./prisma";
async function getUser() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const userWithRelations = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
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
      emailVerified: true,
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
