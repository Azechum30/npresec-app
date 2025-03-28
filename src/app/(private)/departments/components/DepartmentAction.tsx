import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useEditDepartment } from "./use-edit-department"
import { deleteDepartment } from "./delete-departments-action"
import { toast } from "sonner"
import { useStore } from "./use-department-optimistic-store"
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete"
import { getDepartment } from "./get-department"

export default function DepartmentActions({
	id,
	code
}: {
	id: string
	code?: string
}) {
	const { onOpen } = useEditDepartment()
	const { deleteDepartment: Delete, addNew } = useStore()
	const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete()

	const handleSingleDelete = async () => {
		const ok = await confirmDelete()

		if (ok) {
			Delete(code as string)
			const res = await deleteDepartment(id)
			if ("error" in res) {
				const getDeletedDepartment = await getDepartment(id)
				if (getDeletedDepartment.success) {
					addNew(getDeletedDepartment.department! as any)
				}
				return toast.error(res.error)
			}

			toast.success("department deleted Successfully!")
		}
	}
	return (
		<>
			<ConfirmDeleteComponent />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size='sm'
						variant='ghost'
					>
						<MoreHorizontal className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='center'>
					<DropdownMenuLabel className='text-xs'>
						Actions
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => onOpen(id)}>
						<Edit className='size-4 mr-1' />
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={async () => await handleSingleDelete()}
					>
						<Trash2 className='size-4 mr-1' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
