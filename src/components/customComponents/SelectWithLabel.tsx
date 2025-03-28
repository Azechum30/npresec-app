import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	SelectScrollDownButton,
	SelectScrollUpButton
} from "@/components/ui/select"

import { useFormContext } from "react-hook-form"
import {
	FormField,
	FormMessage,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription
} from "../ui/form"
import { InputHTMLAttributes } from "react"

type SelectWithLabelProps<T> = {
	name: keyof T & string
	fieldTitle: string
	className?: string
	placeholder?: string
	data: any[]
} & InputHTMLAttributes<HTMLSelectElement>

export default function SelectWithLabel<T>({
	name,
	fieldTitle,
	className,
	placeholder,
	data,
	...props
}: SelectWithLabelProps<T>) {
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
						<Select
							defaultValue={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger className={className}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent>
								{data.map((val) => (
									<SelectItem
										key={val}
										value={val}
									>
										{val}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
