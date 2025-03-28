import { UploadCloud } from "lucide-react"
import { Button } from "../ui/button"
import { useOpenCreateTeacherDialog } from "@/app/(private)/teachers/hooks/use-open-create-teacher-dialog"
import { usePathname } from "next/navigation"
import React from "react"

const UploadButton: React.FC<{ className?: string }> = ({ className }) => {
	const { onOpen } = useOpenCreateTeacherDialog()
	const pathname = usePathname().split("/").pop()

	const dialogId =
		pathname === "teachers" ? "bulkCreateTeachers" : "bulkCreateDepartments"
	return (
		<Button
			variant='outline'
			onClick={() => onOpen(dialogId)}
			className={className}
		>
			<UploadCloud className='size-5' />
			Upload
		</Button>
	)
}

export default UploadButton
