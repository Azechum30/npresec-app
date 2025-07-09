import { PrismaClient } from "../../prisma/generated/client";

// Type-safe global variable
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent multiple instances in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Store in globalThis only in non-production
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Add middleware-specific export
export const prismaMiddleware =
  process.env.NODE_ENV === "production"
    ? prisma
    : new PrismaClient({
        log: ["error"],
      });
