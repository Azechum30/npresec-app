"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import CreateDepartment from "./create-department"
import { useCreateDepartment } from "./use-open-create-department"
import { createDepartment } from "./create-department-action"
import { useStore } from "./use-department-optimistic-store"
import { toast } from "sonner"
import { DepartmentType } from "@/lib/validation"

export default function CreateDepartmentDialog() {
	const { open, onClose } = useCreateDepartment()
	const { addNew, deleteDepartment, updateDepartment } = useStore()

	async function handleSubmit(data: DepartmentType) {
		addNew(data as any)

		const response = await createDepartment(data)

		if (!response?.success) {
			deleteDepartment(data.code)
			return toast.error(response?.error)
		}
		updateDepartment(data.code, response?.response as any)
		toast.success("department created successfully!")
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			<DialogContent className='h-full'>
				<DialogHeader className='bg-background backdrop-blur-lg'>
					<DialogTitle>Create A New Department</DialogTitle>
					<DialogDescription>
						Kindly fill the form to create a new department
					</DialogDescription>
				</DialogHeader>
				<CreateDepartment onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	)
}
