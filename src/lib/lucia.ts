import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Lucia } from "lucia"
import { prisma } from "./prisma"

interface DatabaseUserAttributes {
	id: string
	username: string
	email: string
	role: string
	picture?: string | null
}
const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "auth-session-token",
		expires: true,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (databaseUserAttributes) => ({
		id: databaseUserAttributes.id,
		username: databaseUserAttributes.username,
		email: databaseUserAttributes.email,
		role: databaseUserAttributes.role,
		picture: databaseUserAttributes.picture
	})
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}
