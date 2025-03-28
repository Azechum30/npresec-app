import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { useOpenCreateTeacherDialog } from "../hooks/use-open-create-teacher-dialog"
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete"
import { deleteTeacherRequest, getTeacher } from "../actions/server"
import { useTransition } from "react"
import { useTeacherStore } from "../hooks/use-teacher-store"
import { toast } from "sonner"

export default function TeacherActions({
	id,
	employeeId
}: {
	id: string
	employeeId: string
}) {
	const { onOpen } = useOpenCreateTeacherDialog()
	const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete()
	const [isPending, startTransition] = useTransition()
	const { deleteTeacher, addTeacher } = useTeacherStore()

	const handleDelete = () => {
		deleteTeacher(employeeId)
		startTransition(async () => {
			const res = await deleteTeacherRequest(id)

			if ("error" in res) {
				toast.error(res.error)
				const rollback = await getTeacher(id)
				if ("error" in rollback) return
				addTeacher(rollback)
			} else {
				toast.success(
					"Selected teacher records have been deleted successfully!"
				)
			}
		})
	}

	if (isPending) {
		return (
			<div className='w-full max-w-md h-full max-h-24 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[100] bg-muted rounded-md flex justify-center items-center'>
				<Loader2 className='size-8 animate-spin' />
			</div>
		)
	}
	return (
		<>
			<ConfirmDeleteComponent />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
					>
						<MoreHorizontal className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuLabel className='text-sm text-muted-foreground'>
							Actions
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onOpen("editTeacher", id)}
						>
							<Edit className='size-4' /> Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								const ok = await confirmDelete()
								if (ok) {
									handleDelete()
								}
							}}
						>
							<Trash2 className='size-4' /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
		</>
	)
}
