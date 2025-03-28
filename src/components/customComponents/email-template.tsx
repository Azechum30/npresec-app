import * as React from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card"

interface EmailTemplateProps {
	firstName: string
	lastName: string
	loginCredentials: {
		email: string
		password: string
	}
	appUrl: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
	lastName,
	loginCredentials,
	appUrl
}) => (
	<Card
		style={{ borderRadius: "6px", boxShadow: "1px 1px rgba(0,0,0,0.75)" }}
	>
		<CardHeader
			className='border-b'
			style={{ borderBottom: "1px solid rgba(0,0,0,0.75)" }}
		>
			<CardTitle
				style={{
					fontFamily: "Poppins",
					fontSize: "20px",
					fontWeight: "bold"
				}}
			>
				Presby SHTS, Nakpanduri
			</CardTitle>
			<CardDescription>
				Management Information System Onboarding
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p>
				Welcome,{" "}
				<span
					className='font-bold'
					style={{ fontWeight: "bold" }}
				>
					{firstName} {lastName}
				</span>{" "}
				to the onboarding of all staff onto the School&apos;s Management
				Information System. The system is designed to track data of all
				staff and students for an efficient data management. Kindly find
				below your login credentials and use the link below to log into
				your account. You will be immediately prompted to change your
				password upon your first attempt to sign into your account.
				Kindly do so to stay secured on the system.
			</p>
			<p className='mb-2'>
				App URL: <a href={appUrl}>{appUrl}</a>
			</p>

			<p>
				Login Credentials:{" "}
				<span
					className='block'
					style={{ display: "block" }}
				>
					<strong>Email: {loginCredentials.email}</strong>
				</span>
				<span
					className='block'
					style={{ display: "block" }}
				>
					<strong>Password: {loginCredentials.password}</strong>
				</span>
			</p>

			<p
				className='mt-4'
				style={{ marginTop: "10px", marginBottom: "0px" }}
			>
				Kind regards!
			</p>
			<p className='font-bold'>itsupport@npresec.org</p>
		</CardContent>
	</Card>
)
