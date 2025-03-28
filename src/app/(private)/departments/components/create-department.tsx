"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/ui/form"
import InputWithLabel from "@/components/customComponents/InputWithLabel"
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel"
import SelectWithLabel from "@/components/customComponents/SelectWithLabel"
import { PlusCircle, Save, Trash2 } from "lucide-react"
import { DepartmentType, DepartmentSchema } from "@/lib/validation"
import LoadingButton from "@/components/customComponents/LoadingButton"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useCreateDepartment } from "./use-open-create-department"
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete"
import { useEditDepartment } from "./use-edit-department"
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel"
import { TeacherResponseType } from "@/lib/types"
import { getTeachers } from "../../teachers/actions/server"
import { toast } from "sonner"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

type onCreateSubmit =
	| {
			success: boolean
			error: string
			response?: undefined
	  }
	| {
			success: boolean
			response: {
				name: string
				code: string
				description: string | null
			}
			error?: undefined
	  }
	| undefined

type onDeleteResponseType = Promise<
	| {
			name: string
			code: string
			description: string | null
			headId: string | null
			id: string
			createdAt: Date
	  }
	| {
			error: string
	  }
	| string
	| number
	| undefined
>

type onSubmitFunction = (
	data: DepartmentType
) => Promise<onCreateSubmit | string | number | void>

type CreateDepartmentProps = {
	id?: string
	onSubmit: onSubmitFunction
	onDelete?: (id: string) => onDeleteResponseType
	defaultValues?: DepartmentType
}

export default function CreateDepartment({
	id,
	defaultValues,
	onSubmit,
	onDelete
}: CreateDepartmentProps) {
	const form = useForm<DepartmentType>({
		resolver: zodResolver(DepartmentSchema),
		defaultValues: defaultValues
			? defaultValues
			: {
					code: "",
					headId: undefined,
					name: "",
					description: "",
					createdAt: undefined
			  }
	})

	const [isPending, startTransition] = useTransition()
	const { onClose } = useCreateDepartment()
	const { onClose: onEditClose } = useEditDepartment()
	const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete()
	const [teachers, setTeachers] = useState<TeacherResponseType[]>([])

	const memoizedTeachers = useMemo(() => teachers, [teachers])

	useEffect(() => {
		const fetchTeachers = async () => {
			const res = await getTeachers()
			if (res.error) {
				return toast.error(res.error)
			}
			setTeachers(res.teachers!)
		}

		fetchTeachers()
	}, [])

	async function handleSubmit(values: DepartmentType) {
		startTransition(async () => {
			try {
				await onSubmit(values)
				onClose()
			} catch (error) {
				console.error(error)
			}
		})
	}

	async function handleDelete(id: string) {
		startTransition(async () => {
			try {
				await onDelete?.(id)
				onEditClose()
			} catch (error) {
				console.error(error)
			}
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='space-y-4 h-full overflow-auto p-4'
			>
				<ConfirmDeleteComponent />
				<InputWithLabel<DepartmentType>
					name='name'
					fieldTitle='Name'
					disabled={!!id}
				/>
				<InputWithLabel<DepartmentType>
					name='code'
					fieldTitle='Department Code'
					disabled={!!id}
				/>

				<DatePickerWithLabel<DepartmentType>
					name='createdAt'
					fieldTitle='CreatedAt'
				/>
				<FormField
					control={form.control}
					name='headId'
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className='text-sm'
								htmlFor='headId'
							>
								Head of Department
							</FormLabel>
							<Select
								defaultValue={field.value?.toString()}
								onValueChange={field.onChange}
							>
								<FormControl>
									<SelectTrigger id='headId'>
										<SelectValue placeholder='Select head of epartment' />
									</SelectTrigger>
								</FormControl>
								<SelectContent position='popper'>
									{memoizedTeachers.map((teacher) => (
										<SelectItem
											key={teacher.id}
											value={teacher.id}
										>{`${teacher.firstName} ${teacher?.middleName} ${teacher.lastName}`}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<TextAreaWithLabel<DepartmentType>
					name='description'
					fieldTitle='Description'
				/>
				<div className='flex flex-col gap-y-3'>
					<LoadingButton loading={isPending}>
						{id ? (
							<>
								<Save className='size-5' /> Save
							</>
						) : (
							<>
								<PlusCircle className='size-5' /> Create{" "}
							</>
						)}
					</LoadingButton>
					{id && (
						<LoadingButton
							loading={isPending}
							variant='destructive'
							type='button'
							onClick={async () => {
								const ok = await confirmDelete()
								if (ok) {
									await handleDelete(id)
								}
							}}
						>
							<Trash2 className='size-4 mr-1' /> Delete{" "}
						</LoadingButton>
					)}
				</div>
			</form>
		</Form>
	)
}
