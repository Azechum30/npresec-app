import jwt from "jsonwebtoken"
import { env } from "./server-only-actions/validate-env"

export const generateToken = (userId: string) => {
	const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1hr" })
	return token
}

export const verifyToken = (token: string) => {
	try {
		const decodedToken = jwt.verify(token, env.JWT_SECRET) as {
			userId: string
			expireIn: number
		}

		if (decodedToken.expireIn < Date.now() / 1000) {
			throw new Error("Token has expired!")
		}

		return decodedToken.userId
	} catch (e) {
		throw new Error("Inavlid token!")
	}
}
