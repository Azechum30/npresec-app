import { Row, Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { useConfirmDelete } from "./useConfirmDelete"
import { Loader2, Trash2 } from "lucide-react"
import { useTransition } from "react"

type RowSelectionCompoenentProps<TData> = {
	className?: string
	table: Table<TData>
	onDelete?: (rows: Row<TData>[]) => void
}

export default function RowSelectionComponent<TData>({
	className,
	table,
	onDelete,
	...props
}: RowSelectionCompoenentProps<TData>) {
	const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete()
	const [isPending, startTransition] = useTransition()

	const handleBulkDelete = () => {
		startTransition(() => {
			const rows = table.getSelectedRowModel().rows
			onDelete?.(rows)
			table.resetRowSelection()
		})
	}

	if (isPending) {
		return (
			<div className='w-full max-w-md h-full max-h-24 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-muted flex justify-center items-center rounded-md backdrop-blur-md z-30'>
				<Loader2 className='size-8 animate-spin' />
			</div>
		)
	}

	return (
		<>
			<ConfirmDeleteComponent />
			{table.getSelectedRowModel().rows?.length !== 0 && (
				<Button
					variant='destructive'
					className={className}
					onClick={async () => {
						const ok = await confirmDelete()
						if (ok) {
							handleBulkDelete()
						}
					}}
					{...props}
				>
					<Trash2 className='' /> Delete (
					{table.getSelectedRowModel().rows?.length})
				</Button>
			)}
		</>
	)
}
