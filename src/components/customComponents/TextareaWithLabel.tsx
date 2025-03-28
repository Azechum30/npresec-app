"use client"
import { useFormContext } from "react-hook-form"
import {
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage
} from "../ui/form"
import { Textarea } from "@/components/ui/textarea"
import { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type TextAreaWithLabelProps<T> = {
	name: keyof T & string
	fieldTitle: string
	className?: string
} & InputHTMLAttributes<HTMLTextAreaElement>

export default function TextAreaWithLabel<T>({
	name,
	fieldTitle,
	className,
	...props
}: TextAreaWithLabelProps<T>) {
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
						<Textarea
							id={name}
							rows={5}
							className={cn("w-full max-w-md", className)}
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
