import { z } from "zod"

const envSchema = z.object({
	RESEND_API_KEY: z.string(),
	RESEND_FROM_EMAIL: z.string(),
	NEXT_PUBLIC_URL: z.string().url(),
	JWT_SECRET: z.string()
})

export const env = envSchema.parse(process.env)
