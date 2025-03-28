"use client"

import { Session, User } from "lucia"
import React, { createContext, useContext } from "react"

type SessionContextProps = {
	user: User
	session: Session
}

const SessionContext = createContext<SessionContextProps | null>(null)

export default function SessionProvider({
	children,
	value
}: React.PropsWithChildren<{ value: SessionContextProps }>) {
	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	)
}

export const useGetSession = () => {
	const context = useContext(SessionContext)

	if (!context)
		throw new Error("useGetSession must be used inside a SessionProvider!")

	return context
}
