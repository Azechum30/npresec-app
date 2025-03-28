"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useOpenCreateTeacherDialog } from "../hooks/use-open-create-teacher-dialog"

export default function OpenCreateTeachersButton() {
	const { onOpen, dialogs } = useOpenCreateTeacherDialog()
	return (
		<Button onClick={() => onOpen("createTeacher")}>
			<PlusCircle className='size-5' />
			Add
		</Button>
	)
}
