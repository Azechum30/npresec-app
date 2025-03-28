import { Resend } from "resend"
import { env } from "./server-only-actions/validate-env"
import { EmailTemplate } from "@/components/customComponents/email-template"
import React from "react"


const resend = new Resend(env.RESEND_API_KEY)

type MailProps = {
	to: string[]
	username: string
	data: {
		lastName: string
		email: string
		password: string
	}
}

export const sendMail = async ({ to, username, data }: MailProps) => {
	try {
		const { error } = await resend.emails.send({
			from: `Presby SHTS <${env.RESEND_FROM_EMAIL}>`,
			to,
			subject: "Welcome to Presby SHTS Managment Information System",
			react: React.createElement(EmailTemplate, {
				firstName: username,
				lastName: data.lastName,
				loginCredentials: {
					email: data.email,
					password: data.password
				},
				appUrl: env.NEXT_PUBLIC_URL
			})
		})

		if (error) {
			throw error
		}

		return { submitted: true }
	} catch (error) {
		throw error
	}
}
