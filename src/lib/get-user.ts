"use server"
import { cookies } from "next/headers"
import { lucia } from "./lucia"
import { prisma } from "./prisma"
import { Session, User } from "lucia"
import { cache } from "react"

export const getSession = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId =
			(await cookies()).get(lucia.sessionCookieName)?.value ?? null

		if (!sessionId) {
			return { user: null, session: null }
		}

		const result = await lucia.validateSession(sessionId)
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				)
				;(await cookies()).set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
			if (!result.session || !result.user) {
				const sessionCookie = lucia.createBlankSessionCookie()
				;(await cookies()).set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}

			// const verifiedUser = await prisma.user.findUnique({
			// 	where: {
			// 		id: user?.id
			// 	},
			// 	select: {
			// 		username: true,
			// 		email: true,
			// 		role: true,
			// 		picture: true
			// 	}
			// })
		} catch (error) {}
		return result
	}
)
