"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import CreateDepartment from "./create-department"
import { useEditDepartment } from "./use-edit-department"
import { useEffect, useState } from "react"
import { getDepartment } from "./get-department"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateDepartmentAction } from "./create-department-action"
import { useStore } from "./use-department-optimistic-store"
import { DepartmentType } from "@/lib/validation"
import { deleteDepartment } from "./delete-departments-action"

export default function EditDepartment() {
	const { id, open, onClose } = useEditDepartment()
	const { updateDepartment, deleteDepartment: Delete, addNew } = useStore()

	const [defaultValues, setDefaultValues] = useState<
		DepartmentType | undefined
	>(undefined)

	useEffect(() => {
		const fetchDepartment = async () => {
			try {
				const response = await getDepartment(id)

				if (response?.error) {
					return toast.error(response.error)
				}

				setDefaultValues({
					...response?.department,
					code: response?.department?.code!,
					name: response?.department?.name!,
					headId: response?.department?.headId || undefined,
					description: response?.department?.description || ""
				})
			} catch (error) {
				console.log(error)
			}
		}

		if (id) {
			setDefaultValues(undefined)
			fetchDepartment()
		}
	}, [id])

	async function handleUpdate(data: DepartmentType) {
		updateDepartment(data.code, data as any)
		const response = await updateDepartmentAction(id, data)
		if (!response?.success) {
			updateDepartment(
				defaultValues?.code as string,
				defaultValues as any
			)
			return toast.error(response?.error)
		}

		updateDepartment(
			response?.response?.code as string,
			response?.response as any
		)
		onClose()

		toast.success("record updated successfully!")
		return response
	}

	async function handleDelete(id: string) {
		Delete(defaultValues?.code as string)
		const res = await deleteDepartment(id)

		if ("error" in res) {
			addNew(defaultValues as any)
			return toast.error(res.error)
		}

		toast.success("record deleted successfully")
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			{defaultValues ? (
				<DialogContent className='h-full'>
					<DialogHeader>
						<DialogTitle>Edit Department Data</DialogTitle>
						<DialogDescription>
							Kindly make changes and save your changes in
							real-time!
						</DialogDescription>
					</DialogHeader>
					<CreateDepartment
						id={id}
						defaultValues={defaultValues}
						onSubmit={handleUpdate}
						onDelete={handleDelete}
					/>
				</DialogContent>
			) : (
				<DialogContent>
					<DialogHeader className='sr-only'>
						<DialogTitle>Loading Data</DialogTitle>
						<DialogDescription>Loading Data</DialogDescription>
					</DialogHeader>
					<div className='flex justify-center items-center h-full'>
						<Loader2 className='size-4 animate-spin' />
					</div>
				</DialogContent>
			)}
		</Dialog>
	)
}
