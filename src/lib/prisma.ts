import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const client =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["error", "warn"]
				: ["error"]
	})

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = client
}

export const prisma = client
