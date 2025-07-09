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
import {z} from "zod"
import {isZodFieldRequired} from "@/lib/isZodFieldRequired";

type InputWithLabelProps<T> = {
	name: keyof T & string
	fieldTitle: string
	className?: string
	schema?: z.ZodSchema<any>
} & InputHTMLAttributes<HTMLInputElement>

export default function PasswordInputWithLabel<T>({
	name,
	fieldTitle,
	className,
	schema,
	...props
}: InputWithLabelProps<T>) {
	const form = useFormContext()

	const isRequired= (()=>{
		if(schema){
			const fieldSchema = schema instanceof z.ZodObject ? schema.shape[name] : schema;
			return isZodFieldRequired(fieldSchema);
		}else{
			return false
		}
	})()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel
						htmlFor={name}
						className={cn("text-sm font-medium", isRequired && "flex items-center gap-1", className)}
					>
						{fieldTitle}
						{isRequired && <span className="text-red-400 flex justify-center items-center h-full">*</span>}
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
