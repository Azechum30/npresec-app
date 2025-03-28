import {
	useReactTable,
	flexRender,
	ColumnDef,
	getCoreRowModel,
	Row,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import TableFooterDescription from "@/components/customComponents/TableFooterData"
import TopActions from "@/components/customComponents/TopActions"
import { fuzzyFilter } from "@/lib/fuzzyFilter"
import { useState } from "react"

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onDelete?: (rows: Row<TData>[]) => void
}

const ClassesDataTable = <TData, TValue>({
	columns,
	data,
	onDelete
}: DataTableProps<TData, TValue>) => {
	const [sorting, setIsorting] = useState<SortingState>([])

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setIsorting,
		state: {
			sorting
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: fuzzyFilter
	})

	return (
		<div className='mt-4'>
			<TopActions
				table={table}
				onDelete={onDelete}
				data={data}
			/>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroups) => (
							<TableRow key={headerGroups.id}>
								{headerGroups.headers.map((header) => (
									<TableHead
										key={header.id}
										className='text-center'
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className='text-center'
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell>No rows found!</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<TableFooterDescription table={table} />
		</div>
	)
}

export default ClassesDataTable
