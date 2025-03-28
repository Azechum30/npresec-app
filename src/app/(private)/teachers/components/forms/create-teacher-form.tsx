import { useForm } from "react-hook-form"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/ui/form"
import {
	TeacherEditSchema,
	TeacherEditType,
	TeacherSchema,
	TeacherType
} from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import InputWithLabel from "@/components/customComponents/InputWithLabel"
import SelectWithLabel from "@/components/customComponents/SelectWithLabel"
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel"
import { useEffect, useMemo, useState, useTransition } from "react"
import { getServerSideProps } from "@/app/(private)/departments/components/getServerSideProps"
import { DepartmentResponseType, TeacherResponseType } from "@/lib/types"
import { toast } from "sonner"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import LoadingButton from "@/components/customComponents/LoadingButton"
import { PlusCircle, Save, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete"

type OnSubmitResponseType = Promise<
	TeacherResponseType | { error?: string } | undefined
>

type CreateTeacherProps = {
	onSubmit: (data: TeacherType) => OnSubmitResponseType
	id?: string
	defaultValues?: TeacherType
	onDelete?: () => void
}

export default function CreateTeacherForm({
	onSubmit,
	id,
	defaultValues,
	onDelete
}: CreateTeacherProps) {
	const form = useForm<TeacherType>({
		resolver: zodResolver(TeacherSchema),
		defaultValues: defaultValues
			? defaultValues
			: {
					firstName: "",
					lastName: "",
					middleName: "",
					birthDate: undefined,
					gender: "",
					rgNumber: "",
					ssnitNumber: "",
					dateOfFirstAppointment: undefined,
					phone: "",
					academicQual: "",
					departmentId: undefined,
					email: "",
					employeeId: "",
					ghcardNumber: "",
					maritalStatus: "",
					rank: "",
					username: "",
					licencedNumber: ""
			  }
	})

	const [departments, setDepartments] = useState<
		DepartmentResponseType[] | undefined
	>()
	const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete()

	const memoizedDpeartments = useMemo(() => departments, [departments])

	useEffect(() => {
		const fetchDepartments = async () => {
			const res = await getServerSideProps()
			if (res.error) {
				return toast.error(res.error)
			}

			setDepartments(res.data)
		}
		fetchDepartments()
	}, [])

	const [isPending, startTransition] = useTransition()
	const [DeleteIsPending, startDeleteTransition] = useTransition()

	function handleSubmit(data: TeacherType) {
		startTransition(async () => {
			await onSubmit(data)
		})
	}

	function handleDelete() {
		startDeleteTransition(() => {
			onDelete?.()
		})
	}

	return (
		<>
			<ConfirmDeleteComponent />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto'
				>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='firstName'
							fieldTitle='First Name'
						/>
						<InputWithLabel<TeacherType>
							name='lastName'
							fieldTitle='Last Name'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='middleName'
							fieldTitle='Middle Name'
						/>
						<SelectWithLabel<TeacherType>
							name='gender'
							fieldTitle='Gender'
							data={["Male", "Female"]}
							placeholder='Select gender'
							className='max-w-md'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<DatePickerWithLabel<TeacherType>
							name='birthDate'
							fieldTitle='Date of Birth'
						/>
						<SelectWithLabel<TeacherType>
							name='maritalStatus'
							fieldTitle='Marital Status'
							data={["Married", "Single", "Divorced", "Engaged"]}
							placeholder='Select Marital Status'
							className='max-w-md'
						/>
					</div>
					{id === undefined && (
						<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
							<InputWithLabel<TeacherType>
								name='email'
								fieldTitle='Email'
								type='email'
								disabled={id !== undefined}
							/>
							<InputWithLabel<TeacherType>
								name='username'
								fieldTitle='Username'
								className='max-w-md'
								disabled={id !== undefined}
							/>
						</div>
					)}
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='phone'
							fieldTitle='Phone Number'
						/>
						<InputWithLabel<TeacherType>
							name='employeeId'
							fieldTitle='Staff ID'
							className='max-w-md'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='academicQual'
							fieldTitle='Academic Qualification'
						/>
						<InputWithLabel<TeacherType>
							name='rank'
							fieldTitle='Current GES Rank'
							placeholder='e.g Principal Supt'
							className='max-w-md'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='ssnitNumber'
							fieldTitle='SSNIT Number'
						/>
						<InputWithLabel<TeacherType>
							name='ghcardNumber'
							fieldTitle='GhanaCard Number'
							className='max-w-md'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<DatePickerWithLabel<TeacherType>
							name='dateOfFirstAppointment'
							fieldTitle='Date of First Appointment'
						/>
						<InputWithLabel<TeacherType>
							name='rgNumber'
							fieldTitle='Registered Number'
							className='max-w-md'
						/>
					</div>
					<div className=' w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 '>
						<InputWithLabel<TeacherType>
							name='licencedNumber'
							fieldTitle='Licenced Number'
						/>
						<FormField
							control={form.control}
							name='departmentId'
							render={({ field }) => (
								<FormItem>
									<FormLabel
										htmlFor='departmentId'
										className='text-sm'
									>
										Department
									</FormLabel>
									<Select
										defaultValue={field.value as string}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Department' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{memoizedDpeartments ===
											undefined ? (
												<Skeleton className='w-full h-full'></Skeleton>
											) : (
												memoizedDpeartments?.map(
													(department) => (
														<SelectItem
															key={department.id}
															value={
																department.id ||
																""
															}
														>
															{department.name}
														</SelectItem>
													)
												)
											)}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					</div>
					<div className='grid grid-cols-1 space-y-4'>
						<LoadingButton loading={isPending}>
							{!!id ? (
								<>
									<Save className='size-5' />
									Save
								</>
							) : (
								<>
									<PlusCircle className='size-5' />
									Create
								</>
							)}
						</LoadingButton>
						{!!id && (
							<LoadingButton
								loading={DeleteIsPending}
								type='button'
								variant='destructive'
								onClick={async () => {
									const ok = await confirmDelete()
									if (ok) {
										handleDelete()
									}
								}}
							>
								<Trash2 className='size-5' /> Delete
							</LoadingButton>
						)}
					</div>
				</form>
			</Form>
		</>
	)
}
