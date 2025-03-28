import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel"
import InputWithLabel from "@/components/customComponents/InputWithLabel"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	ClassesResponseType,
	DepartmentResponseType,
	TeacherResponseType
} from "@/lib/types"
import { ClassesSchema, ClassesType, grades } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useState, useEffect, useMemo } from "react"
import { getServerSideProps } from "../../departments/components/getServerSideProps"
import { Skeleton } from "@/components/ui/skeleton"
import TagsComponent from "@/components/customComponents/TagsComponent"
import { getTeachers } from "../../teachers/actions/server"
import LoadingButton from "@/components/customComponents/LoadingButton"
import { PlusCircle, Trash } from "lucide-react"

type onSubmitFormResponse = ClassesResponseType | { errors?: {} } | undefined

type CreateClassFormProps = {
	onSubmit: (data: ClassesType) => Promise<onSubmitFormResponse>
	id?: string
	defaultValues?: ClassesType
	onDelete?: () => void
}

const CreateClassForm: FC<CreateClassFormProps> = ({
	onSubmit,
	onDelete,
	id,
	defaultValues
}) => {
	const form = useForm<ClassesType>({
		defaultValues: defaultValues
			? { ...defaultValues }
			: {
					code: "",
					createdAt: undefined,
					departmentId: undefined,
					name: "",
					teachers: []
			  },
		resolver: zodResolver(ClassesSchema)
	})

	const [departments, setDepartments] = useState<DepartmentResponseType[]>([])
	const [teachers, setTeachers] = useState<TeacherResponseType[]>([])

	const memoizedDepartments = useMemo(() => departments, [departments])
	const memoizedTeachers = useMemo(() => teachers, [teachers])

	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		const fetchDepartments = async () => {
			const [teachers, departments] = await Promise.all([
				getTeachers(),
				getServerSideProps()
			])

			if (teachers.error || departments.error) return

			setDepartments(departments?.data!)
			setTeachers(teachers.teachers!)
		}

		fetchDepartments()
	}, [])

	const handleSubmit = (data: ClassesType) => {
		startTransition(async () => {
			const res = await onSubmit(data)
			if (res !== undefined && "errors" in res) {
				const errors = res.errors!

				if ("code" in errors) {
					form.setError("code", {
						type: "server",
						message: errors.code as string
					})
				} else if ("name" in errors) {
					form.setError("name", {
						type: "server",
						message: errors.name as string
					})
				} else if ("level" in errors) {
					form.setError("level", {
						type: "server",
						message: errors.level as string
					})
				} else if ("teachers" in errors) {
					form.setError("teachers", {
						type: "server",
						message: errors.teachers as string
					})
				} else if ("departmentId" in errors) {
					form.setError("departmentId", {
						type: "server",
						message: errors.departmentId as string
					})
				} else if ("createdAt" in errors) {
					form.setError("createdAt", {
						type: "server",
						message: errors.createdAt as string
					})
				}
			}
		})
	}

	const handleTeacherChange = (selectedTeachers: TeacherResponseType[]) => {
		form.setValue(
			"teachers",
			selectedTeachers.map((teacher) => teacher.id)
		)
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto'
			>
				<InputWithLabel<ClassesType>
					name='name'
					fieldTitle='Class Name'
					disabled={id ? true : false}
				/>
				<InputWithLabel<ClassesType>
					name='code'
					fieldTitle='Class Code'
					disabled={id ? true : false}
				/>

				<FormField
					name='departmentId'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor='departmentId'
								className='text-sm'
							>
								Associated Department
							</FormLabel>
							<Select
								defaultValue={field.value ? field.value : ""}
								onValueChange={field.onChange}
							>
								<FormControl>
									<SelectTrigger className='w-full max-w-md'>
										<SelectValue
											placeholder='Select department'
											className='placeholder:text-muted-foreground placeholder:text-sm'
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent position='popper'>
									{memoizedDepartments === undefined ? (
										<Skeleton className='w-full h-4'></Skeleton>
									) : memoizedDepartments?.length === 0 ? (
										<SelectItem value='no records found'>
											No Records found
										</SelectItem>
									) : (
										memoizedDepartments?.map(
											(department) => (
												<SelectItem
													key={department.id}
													value={department.id}
												>
													{department.name}
												</SelectItem>
											)
										)
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name='level'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor='level'
								className='text-sm'
							>
								Year Group
							</FormLabel>
							<Select
								defaultValue={field.value ? field.value : ""}
								onValueChange={field.onChange}
							>
								<FormControl>
									<SelectTrigger className='w-full max-w-md'>
										<SelectValue
											placeholder='Select class year group'
											className='placeholder:text-muted-foreground placeholder:text-sm'
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent position='popper'>
									{grades.map((grade) => (
										<SelectItem
											value={grade}
											key={grade}
										>
											{grade.split("_").join(" ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DatePickerWithLabel<ClassesType>
					name='createdAt'
					fieldTitle='Created Date'
				/>

				<FormField
					control={form.control}
					name='teachers'
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor='teachers'>
								Assigned Teachers
							</FormLabel>
							<FormControl>
								<TagsComponent
									value={
										teachers.filter((teacher) =>
											field.value?.includes(teacher.id)
										) || []
									}
									onChange={handleTeacherChange}
									placeHolder='Add Teachers'
									name={field.name}
									onBlur={field.onBlur}
									ref={field.ref}
									suggestions={memoizedTeachers}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex flex-col gap-y-3'>
					<LoadingButton loading={isPending}>
						{isPending ? (
							"Loading"
						) : (
							<span className='flex items-center space-x-2'>
								<PlusCircle className='size-5 mr-2' /> Create
							</span>
						)}
					</LoadingButton>

					{!!id && (
						<LoadingButton
							loading={false}
							type='button'
							variant='destructive'
						>
							<Trash className='size-5' />
							<span>Delete</span>
						</LoadingButton>
					)}
				</div>
			</form>
		</Form>
	)
}

export default CreateClassForm
