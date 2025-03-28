"use client"
import { FC } from "react"
import { Button } from "../ui/button"
import { PlusCircle } from "lucide-react"
import { useOpenCreateTeacherDialog } from "@/app/(private)/teachers/hooks/use-open-create-teacher-dialog"

const OpenDialogs: FC<{ dialogKey: string }> = ({ dialogKey }) => {
	const { onOpen } = useOpenCreateTeacherDialog()

	return (
		<Button onClick={() => onOpen(dialogKey)}>
			<PlusCircle className='size-5 mr-1' />
			<span>Add</span>
		</Button>
	)
}

export default OpenDialogs
