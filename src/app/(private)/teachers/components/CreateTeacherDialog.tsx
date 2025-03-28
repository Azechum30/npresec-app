"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import { useOpenCreateTeacherDialog } from "../hooks/use-open-create-teacher-dialog"
import CreateTeacherForm from "./forms/create-teacher-form"
import { TeacherType } from "@/lib/validation"
import { createTeacher } from "../actions/server"
import { useTeacherStore } from "../hooks/use-teacher-store"
import { toast } from "sonner"

export default function CreateTeacherDialog() {
	const { dialogs, onClose } = useOpenCreateTeacherDialog()
	const { addTeacher, deleteTeacher, updateTeacher } = useTeacherStore()
	const handleSubmit = async (data: TeacherType) => {
		addTeacher(data as any)
		const res = await createTeacher(data)
		if (res?.teacher?.teacher) {
			onClose("createTeacher")
			toast.success("Teacher added successfully!")
			updateTeacher(
				res?.teacher?.teacher.employeeId as string,
				res.teacher.teacher
			)
		} else if (res?.teacher?.errors) {
			toast.error(res.teacher.errors.join("\n"))
			deleteTeacher(data.employeeId)
		} else {
			toast.error(res.error)
			deleteTeacher(data.employeeId)
		}
		return res
	}
	return (
		<Dialog
			open={dialogs["createTeacher"]}
			onOpenChange={() => onClose("createTeacher")}
		>
			<DialogContent className='w-full md:max-w-2xl h-full'>
				<DialogHeader>
					<DialogTitle>Create New Teacher Profile</DialogTitle>
					<DialogDescription>
						Fill the form to add a new teacher's records to the
						system or database.
					</DialogDescription>
				</DialogHeader>
				<CreateTeacherForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	)
}
