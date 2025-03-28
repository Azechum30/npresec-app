"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import CreateClassForm from "../forms/create-class-form"
import { useOpenCreateTeacherDialog } from "../../teachers/hooks/use-open-create-teacher-dialog"
import { ClassesType } from "@/lib/validation"
import { createClassAction } from "../actions/server-actions"

import { toast } from "sonner"

export default function CreateClassDialog() {
	const { dialogs, onClose } = useOpenCreateTeacherDialog()

	const handleSubmit = async (values: ClassesType) => {
		const res = await createClassAction(values)
		if (res !== undefined && "errors" in res) {
			return { errors: res.errors }
		} else if (res !== undefined && res.class) {
			onClose("createClass")
			toast.success("Class created successfully")
			return res.class
		} else if (res !== undefined && "prismaErrors" in res) {
			toast.error(res.prismaErrors?.join("\n"))
		} else {
			toast.error(res.error)
		}
	}

	return (
		<Dialog
			open={dialogs["createClass"]}
			onOpenChange={() => onClose("createClass")}
		>
			<DialogContent className='h-full w-full'>
				<DialogHeader>
					<DialogTitle>Create a New Class</DialogTitle>
					<DialogDescription>
						Fill the form to create a new class group
					</DialogDescription>
				</DialogHeader>
				<CreateClassForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	)
}
