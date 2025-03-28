"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import CreateTeacherForm from "./forms/create-teacher-form"
import { useOpenCreateTeacherDialog } from "../hooks/use-open-create-teacher-dialog"
import { useEffect, useState } from "react"
import {
	deleteTeacherRequest,
	getTeacher,
	updateTeacher
} from "../actions/server"
import { toast } from "sonner"
import { TeacherEditType, TeacherType } from "@/lib/validation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTeacherStore } from "../hooks/use-teacher-store"

export default function EditTeacherDialog() {
	const { id, dialogs, onClose } = useOpenCreateTeacherDialog()
	const {
		updateTeacher: TeacherUpdate,
		deleteTeacher,
		addTeacher
	} = useTeacherStore()

	const [defaultValues, setDefaultValues] = useState<
		TeacherType | undefined
	>()

	useEffect(() => {
		const fetchTeacher = async () => {
			const res = await getTeacher(id as string)
			if ("error" in res) {
				return toast.error(res.error)
			}
			setDefaultValues({
				...res,
				email: "",
				username: "",
				ssnitNumber: res.ssnitNumber || "",
				licencedNumber: res.licencedNumber || "",
				rank: res.rank || ""
			})
		}

		if (id) {
			setDefaultValues(undefined)
			fetchTeacher()
		}
	}, [id])

	const handleUpdate = async (data: TeacherType) => {
		TeacherUpdate(data.employeeId, data as any)
		const res = await updateTeacher(String(id), data)

		if (res?.error) {
			toast.error(res.error)
			TeacherUpdate(
				defaultValues?.employeeId as string,
				defaultValues as any
			)
		} else {
			toast.success("Teacher record updated successfully!")
			onClose("editTeacher")
			TeacherUpdate(res?.data?.employeeId as any, res?.data as any)
		}

		return res
	}

	const handleDelete = async () => {
		deleteTeacher(defaultValues?.employeeId as string)
		const res = await deleteTeacherRequest(id as string)
		if ("error" in res) {
			toast.error(res.error)
			const deletedRecord = await getTeacher(id as string)
			if ("error" in deletedRecord) {
				return
			}
			addTeacher(deletedRecord)
		} else {
			toast.success("The selected teacher was deleted successfully")
			onClose("editTeacher")
		}
	}

	return (
		<Dialog
			open={dialogs["editTeacher"]}
			onOpenChange={() => onClose("editTeacher")}
		>
			<DialogContent
				className={cn(
					defaultValues !== undefined && "h-full max-w-2xl"
				)}
			>
				{defaultValues ? (
					<>
						<DialogHeader>
							<DialogTitle>Edit Teacher Profile</DialogTitle>
							<DialogDescription className='max-w-prose'>
								Make changes to the selected teacher's profile
								data and save the changes in real-time
							</DialogDescription>
						</DialogHeader>
						<CreateTeacherForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={handleUpdate}
							onDelete={handleDelete}
						/>
					</>
				) : (
					<>
						<DialogHeader className='sr-only'>
							<DialogTitle>Loading Teacher Profile</DialogTitle>
							<DialogDescription>Loading</DialogDescription>
						</DialogHeader>
						<div className='w-full h-full flex justify-center items-center'>
							<Loader2 className='size-8 animate-spin' />
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
