"use client"

import { InputHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form"
import { cn } from "@/lib/utils"
import { PasswordInput } from "./PasswordInput"

type InputWithLabelProps<T> = {
	name: keyof T & string
	fieldTitle: string
	className?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function PasswordInputWithLabel<T>({
	name,
	fieldTitle,
	className,
	...props
}: InputWithLabelProps<T>) {
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel
						htmlFor={name}
						className='text-sm'
					>
						{fieldTitle}
					</FormLabel>
					<FormControl>
						<PasswordInput
							id={name}
							className={cn(
								"w-full max-w-md disabled:text-gray-600 dark:disabled:text-blue-400",
								className
							)}
							{...field}
							{...props}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
