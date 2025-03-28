import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import React, { FC, useEffect } from "react"
import { buttonVariants } from "../ui/button"
import { X } from "lucide-react"
import { useState } from "react"
import { TeacherResponseType } from "@/lib/types"

type TagsInputProps = {
	name: string
	placeHolder?: string
	value: TeacherResponseType[]
	onChange?: (tags: TeacherResponseType[]) => void
	onBlur?: () => void
	ref: React.Ref<HTMLInputElement>
	suggestions?: TeacherResponseType[]
}

export const TagsComponent: FC<TagsInputProps> = ({
	name,
	placeHolder,
	value = [],
	onChange,
	onBlur,
	ref,
	suggestions = []
}) => {
	const [inputValue, setInputValue] = useState("")
	const [filteredSuggestions, setFilteredSuggestions] = useState<
		TeacherResponseType[]
	>([])

	useEffect(
		function () {
			if (inputValue) {
				const filtered = suggestions.filter(
					(teacher) =>
						teacher.firstName.toLowerCase() ===
							inputValue.toLowerCase() ||
						teacher.lastName.toLowerCase() ===
							inputValue.toLowerCase()
				)
				setFilteredSuggestions(filtered)
			} else {
				setFilteredSuggestions([])
			}
		},
		[inputValue, suggestions]
	)

	const handleRemove = (tagIndex: number) => {
		const newTags = value.filter((_, index) => index !== tagIndex)
		onChange?.(newTags)
	}

	const handleSuggestionClick = (suggestion: TeacherResponseType) => {
		const newTags = [...value, suggestion]
		onChange?.(newTags)
		setInputValue("")
		setFilteredSuggestions([])
	}

	const handleOnChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter" || e.currentTarget.value.trim() === "") return

		const fullName = e.currentTarget.value.trim()

		const selectedTeacher = suggestions.find(
			(teacher) =>
				`${teacher.firstName} ${teacher.lastName}`.toLowerCase() ===
				fullName.toLowerCase()
		)

		if (!selectedTeacher) return

		const newTags = [...value, selectedTeacher]

		onChange?.(newTags!)

		e.currentTarget.value = ""
	}

	return (
		<div className='flex flex-col space-y-4 rounded-md border bg-inherit w-full max-w-md p-4 relative'>
			<div
				className={cn(
					"gap-2 items-center w-full flex-wrap",
					value.length === 0 ? "hidden" : "flex"
				)}
			>
				{value.map((tag, index) => (
					<div
						className={cn(
							"relative",
							buttonVariants({ variant: "secondary", size: "sm" })
						)}
						key={index}
					>
						<span className='pe-5'>
							{tag.firstName} {tag.lastName}
						</span>
						<span
							onClick={() => handleRemove(index)}
							className='bg-background/75 p-[1px] rounded-full flex justify-center items-center absolute top-1/2 right-2 -translate-y-1/2 z-10 text-red-500 cursor-pointer'
						>
							<X className='size-1 ' />
						</span>
					</div>
				))}
			</div>
			<Input
				ref={ref}
				name={name}
				className='w-full placeholder:text-sm placeholder:text-muted-foreground'
				placeholder={placeHolder ? placeHolder : "Add tags"}
				onKeyDown={handleOnChange}
				onBlur={onBlur}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			{filteredSuggestions.length > 0 && (
				<div
					className={cn(
						"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-colors",
						buttonVariants({ variant: "default", size: "sm" })
					)}
				>
					{filteredSuggestions.map((teacher, index) => (
						<span
							key={index}
							className='w-full p-2 text-sm text-muted-foreground cursor-pointer rounded-md h-full'
							onClick={() => handleSuggestionClick(teacher)}
						>
							{`${teacher.firstName} ${teacher.lastName}`}
						</span>
					))}
				</div>
			)}
		</div>
	)
}

export default TagsComponent
