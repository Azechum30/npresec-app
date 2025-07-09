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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
		<Card className='w-full h-full max-w-md shadow-2xl hover:shadow-lg transition-shadow duration-300 rounded-none flex flex-col items-center justify-center bg-inherit '>
			<CardHeader>
			<div className=" border-2 rounded-full p-3 size-28 flex justify-center items-center mx-auto ">
				<Avatar className="w-full h-full">
					<AvatarImage src="/logo.png" />
					<AvatarFallback className="font-bold text-4xl bg-background -tracking-widest">NP</AvatarFallback>
				</Avatar>
			</div>
				<CardTitle className=' text-xl uppercase leading-normal mb-2 text-center'>
					Nakpanduri Presby SHTS (MIS)
				</CardTitle>
				<CardDescription className=" w-full flex items-center justify-center gap-4 overflow-clip">
					<Separator  />
					<span className="flex-1 whitespace-nowrap">Log into your account</span>
					<Separator  />
				</CardDescription>
			</CardHeader>
				<CardContent className='space-y-2'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='w-full space-y-4'
						>
							<div>
								<InputWithLabel<SignInType>
									name='email'
									fieldTitle='Email'
									className="font-normal"
									schema={SignInSchema}
								/>
							</div>
							<div>
								<PasswordInputWithLabel<SignInType>
									name='password'
									fieldTitle='Password'
									className="font-normal"
									schema={SignInSchema}
								/>
							</div>
							<div>
								<LoadingButton loading={isPending}>
									Login
								</LoadingButton>
							</div>
							<div className="text-xs text-muted-foreground text-center">
								Forgot your password? {" "}
								<Link className="text-blue-400" href="/forgot-password">Reset your password here</Link>
							</div>
						</form>
					</Form>
				</CardContent>
		</Card>
	)
}
