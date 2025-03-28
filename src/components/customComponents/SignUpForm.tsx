"use client"

import { useForm } from "react-hook-form"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../ui/form"
import InputWithLabel from "./InputWithLabel"
import { signUpAction } from "@/lib/server-only-actions/authenticate"
import { toast } from "sonner"
import { SignUpType, SignUpSchema } from "@/lib/validation"
import LoadingButton from "./LoadingButton"
import { useTransition } from "react"
import PasswordInputWithLabel from "./PasswordInputWithLabel"

export default function SignUpForm() {
	const form = useForm<SignUpType>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: ""
		}
	})

	const [isPending, startTransition] = useTransition()

	async function onSubmit(values: SignUpType) {
		startTransition(async () => {
			const res = await signUpAction(values)
			if (!res.success) {
				toast.error(res.error)
			}
		})
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='mb-2 leading-normal'>
					Welcome to Nakpanduri Presby SHTS Management Information
					System
				</CardTitle>
				<CardDescription>
					Continue to create an account to gain access to our
					intuitive school management information system.
				</CardDescription>
			</CardHeader>
			<CardContent className='overflow-y-auto'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<div className='flex items-center gap-3'>
							<div>
								<InputWithLabel<SignUpType>
									name='username'
									fieldTitle='Username'
								/>
							</div>
							<div>
								<InputWithLabel<SignUpType>
									name='email'
									fieldTitle='Email'
								/>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div>
								<PasswordInputWithLabel<SignUpType>
									name='password'
									fieldTitle='Password'
								/>
							</div>
							<div>
								<PasswordInputWithLabel<SignUpType>
									name='confirmPassword'
									fieldTitle='Confirm Password'
								/>
							</div>
						</div>
						<div className='flex flex-col gap-y-3 mt-4'>
							<LoadingButton loading={isPending}>
								Create an Account
							</LoadingButton>
							<Button
								variant='destructive'
								className='w-full text-base'
								type='button'
								onClick={() => form.reset()}
							>
								Reset
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
