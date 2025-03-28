import { InputHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form"
import DatePicker from "./DatePicker"

type DatePickerWithLabelProps<T> = {
	name: keyof T & string
	fieldTitle: string
} & InputHTMLAttributes<HTMLButtonElement>

export default function DatePickerWithLabel<T>({
	name,
	fieldTitle
}: DatePickerWithLabelProps<T>) {
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel
						className='text-sm'
						htmlFor={name}
					>
						{fieldTitle}
					</FormLabel>
					<FormControl>
						<DatePicker
							id={name}
							date={field.value}
							setDate={field.onChange}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
