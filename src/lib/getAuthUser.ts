import { unstable_cache } from "next/cache";
import { getSession } from "./get-session";
import { prisma } from "./prisma";

// Remove React cache from functions that use headers()
// Instead, cache at the component level or use unstable_cache for data fetching

export async function getAuthUser() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }
  return session.user;
}

const getCachedUser = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
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
  },
  ["getCachedUser"],
  { tags: ["user"], revalidate: 60 * 60 },
);
