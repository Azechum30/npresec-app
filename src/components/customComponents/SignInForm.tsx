"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../ui/form"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card"
import InputWithLabel from "./InputWithLabel"
import { signInAction } from "@/lib/server-only-actions/authenticate"
import { toast } from "sonner"
import { SignInType, SignInSchema } from "@/lib/validation"
import { useTransition } from "react"
import LoadingButton from "./LoadingButton"
import PasswordInputWithLabel from "./PasswordInputWithLabel"
import { useRouter } from "next/navigation"

export default function SignInForm() {
	const form = useForm<SignInType>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	async function onSubmit(values: SignInType) {
		startTransition(async () => {
			const { error, resetPasswordRequired, resetToken } =
				await signInAction(values)
			if (error) {
				toast.error(error)
			} else if (resetPasswordRequired) {
				router.push(`/password-reset?token=${resetToken}`)
			}
		})
	}
	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='leading-normal mb-2'>
					Welcome to Nakpanduri Presby SHTS Management Information
					System
				</CardTitle>
				<CardDescription>
					Kindly log into your account to continue exporing the school
					management information system!
				</CardDescription>
				<CardContent className='space-y-2 px-0 pt-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='w-full space-y-4'
						>
							<div>
								<InputWithLabel<SignInType>
									name='email'
									fieldTitle='Email'
								/>
							</div>
							<div>
								<PasswordInputWithLabel<SignInType>
									name='password'
									fieldTitle='Password'
								/>
							</div>
							<div>
								<LoadingButton loading={isPending}>
									Login
								</LoadingButton>
							</div>
						</form>
					</Form>
				</CardContent>
			</CardHeader>
		</Card>
	)
}
