import { cache } from "react";
import { unstable_cache } from "next/cache";

// =====================================================
// SAFE CACHING STRATEGIES FOR NEXT.JS
// =====================================================

// 1. React cache() - For pure functions (no headers, no external state)
export const memoizePureFunction = cache((fn: (...args: any[]) => any) => fn);

// Example: Pure utility functions
export const formatUserName = cache((firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`.trim();
});

// 2. Next.js unstable_cache() - For data fetching (safe with headers)
export const getCachedUserData = unstable_cache(
  async (userId: string) => {
    // This can safely use headers() and other request-time data
    const { prisma } = await import("./prisma");
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
  },
  ["user-data"], // Cache key
  {
    revalidate: 300, // 5 minutes
    tags: ["user-data"],
  }
);

// 3. Component-level caching with useMemo/useState
// Use this pattern in your components instead of caching server functions

// 4. Database-level caching (recommended for complex data)
export async function getUserWithDatabaseCache(userId: string) {
  const { prisma } = await import("./prisma");

  // Prisma has built-in query caching
  return await prisma.user.findUnique({
    where: { id: userId },
    // 5 minutes
  });
}

// 5. Redis/external cache for frequently accessed data
// export async function getCachedPermissions(userId: string) {
//   const { redis } = await import("./redis"); // Assuming you have Redis setup

//   const cacheKey = `user_permissions:${userId}`;
//   const cached = await redis.get(cacheKey);

//   if (cached) {
//     return JSON.parse(cached);
//   }

//   // Fetch from database
//   const { prisma } = await import("./prisma");
//   const permissions = await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       permissions: {
//         select: { name: true }
//       },
//       role: {
//         select: {
//           permissions: {
//             select: { name: true }
//           }
//         }
//       }
//     }
//   });

//   // Cache for 10 minutes
//   await redis.setex(cacheKey, 600, JSON.stringify(permissions));

//   return permissions;
// }

// =====================================================
// HOW TO USE CACHING SAFELY
// =====================================================

/*
✅ SAFE TO CACHE:
- Pure utility functions
- Static data lookups
- Computations that don't depend on request context

❌ NEVER CACHE:
- Functions that use headers()
- Functions that use cookies()
- Functions that depend on request context
- Server actions (cache results in components instead)

📝 PATTERNS:

// 1. Cache pure functions
export const calculateTotal = cache((items: Item[]) => {
  return items.reduce((sum, item) => sum + item.price, 0);
});

// 2. Cache data fetching with unstable_cache
export const getPosts = unstable_cache(
  async (category: string) => {
    return await db.post.findMany({ where: { category } });
  },
  ["posts"],
  { revalidate: 3600 }
);

// 3. Cache in components with useMemo
function MyComponent({ userId }) {
  const userData = useMemo(() => {
    return getUserData(userId); // Don't cache the function itself
  }, [userId]);

  return <div>{userData.name}</div>;
}

// 4. Cache server action results in components
function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    myServerAction().then(setData);
  }, []);

  return <div>{data}</div>;
}
*/
