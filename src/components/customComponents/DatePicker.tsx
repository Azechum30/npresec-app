"use client"
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction, useMemo } from "react"
import { format, getYear, isValid, setMonth, setYear } from "date-fns"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectScrollUpButton,
	SelectTrigger,
	SelectValue
} from "../ui/select"

type DatePickerProps = {
	startYear?: number
	endYear?: number
	id: string
	date: Date
	setDate: Dispatch<SetStateAction<Date | undefined>>
}

export default function DatePicker({
	date,
	setDate,
	id,
	startYear = getYear(new Date()) - 100,
	endYear = getYear(new Date())
}: DatePickerProps) {
	const years = useMemo(
		() =>
			Array.from(
				{ length: endYear - startYear + 1 },
				(_, i) => startYear + i
			),
		[startYear, endYear]
	)
	const months = Array.from({ length: 12 }, (_, i) => ({
		label: new Date(0, i).toLocaleString("default", { month: "long" }),
		value: i.toString()
	}))

	const handleMonthChange = (month: number) => {
		setDate((prev) => {
			const newDate = prev ? new Date(prev) : new Date()
			const updatedDate = setMonth(newDate, month)
			return isValid(updatedDate) ? updatedDate : new Date()
		})
	}

	const handleYearChange = (year: number) => {
		setDate((prevDate) => {
			const newDate = prevDate ? new Date(prevDate) : new Date()
			const updatedDate = setYear(newDate, year)

			return isValid(updatedDate) ? updatedDate : new Date()
		})
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant='outline'
					className={cn(
						"w-full max-w-md justify-start text-left",
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className='size-5' />
					{date && isValid(date) ? (
						format(date, "PPP")
					) : (
						<span>Select a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='center'
				className='flex flex-col space-y-2 p-2'
			>
				<div className='flex justify-between items-center py-2 space-x-2'>
					<Select
						onValueChange={(value) =>
							handleMonthChange(parseInt(value, 10))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder='Month' />
						</SelectTrigger>
						<SelectContent
							position='popper'
							align='center'
							className='overflow-y-auto h-full'
						>
							<SelectGroup>
								{months.map((month) => (
									<SelectItem
										key={month.value}
										value={month.value}
									>
										{month.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select
						onValueChange={(value) =>
							handleYearChange(parseInt(value, 10))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder='Year' />
						</SelectTrigger>
						<SelectContent
							position='popper'
							align='center'
							className='overflow-y-auto h-full'
						>
							<SelectGroup>
								{years.map((year) => (
									<SelectItem
										key={year}
										value={String(year)}
									>
										{year}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className='rounded-md border mx-auto w-full flex justify-center items-center'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={setDate}
						fromYear={1970}
						toYear={new Date().getFullYear()}
						month={date}
						disabled={(date) =>
							date > new Date() || date < new Date("1900-01-01")
						}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}
