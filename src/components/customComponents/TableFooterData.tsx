import { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight
} from "lucide-react"

type TableFooterDescriptionProps<TData> = {
	table: Table<TData>
}

export default function TableFooterDescription<TData>({
	table
}: TableFooterDescriptionProps<TData>) {
	return (
		<div className='flex justify-between items-center ps-4 pt-4 pb-4'>
			<div className='text-muted-foreground text-sm flex items-center space-x-2 '>
				<div className='hidden lg:block'>
					{table.getSelectedRowModel().rows?.length} of{" "}
					{table.getCoreRowModel().rows?.length} row(s) selected
				</div>
				<div>
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
			</div>

			<div className='flex gap-x-2 items-center text-sm'>
				<Button
					variant='outline'
					title='Go to first page'
					size='sm'
					className='flex items-center justify-center text-center gap-x-1 pe-5'
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronsLeft className='size-5' />
				</Button>
				<Button
					variant='outline'
					size='sm'
					title='Go to previous page'
					className='flex items-center justify-center text-center gap-x-1 pe-5'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft className='size-5' />
				</Button>
				<Button
					variant='outline'
					size='sm'
					title='Go to next page'
					className='flex items-center justify-center text-center gap-x-1 ps-4'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight className='size-5' />
				</Button>
				<Button
					variant='outline'
					size='sm'
					title='Go to next last page'
					className='flex items-center justify-center text-center gap-x-1 ps-4'
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronsRight className='size-5' />
				</Button>
			</div>
		</div>
	)
}
