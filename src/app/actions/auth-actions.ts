"use server";

import { getAuthUser } from "@/lib/getAuthUser";
import { getSession } from "@/lib/get-session";

// ❌ DON'T cache server actions directly - this causes headers issues
// ✅ Cache results at the component level instead

export async function checkAuthAction() {
  try {
    const [sessionData, user] = await Promise.all([
      getSession(),
      getAuthUser(),
    ]);

    if (!sessionData?.session || !sessionData.user || !user) {
      return { success: false, user: null };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { success: false, user: null };
  }
}

// Example of a cacheable data function using Next.js unstable_cache
// This is safe because it doesn't use headers() directly
import { unstable_cache } from "next/cache";

export const getCachedUserRoles = unstable_cache(
  async () => {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.role.findMany({
      select: { id: true, name: true },
    });
  },
  ["user-roles"],
  {
    revalidate: 3600, // 1 hour
    tags: ["roles"],
  }
);
