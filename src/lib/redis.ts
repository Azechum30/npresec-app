import "server-only";

import { Redis } from "@upstash/redis";
import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

const redis = Redis.fromEnv();

export const getCachedUserRole = async (userId: string) => {
  const cachedKey = `user_role:${userId}`;
  const cached = await redis.get(cachedKey);

  if (cached)
    return cached as {
      id: string;
      emailVerified: string;
      role: { name: string };
    };

  const user = await unstable_cache(
    async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          emailVerified: true,
          role: { select: { name: true } },
        },
      });
    },
    ["redis-cache-user"],
    { tags: ["redis-cache-user"], revalidate: 3600 },
  )();

  await redis.setex(cachedKey, 300, user);

  return user;
};

// const getUser = unstable_cache(
//   async function (userId: string) {
//     return await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         emailVerified: true,
//         role: { select: { name: true } },
//       },
//     });
//   },
//   ["redis-cache-user"],
//   { tags: ["redis-cache-user"], revalidate: 3600 },
// );
