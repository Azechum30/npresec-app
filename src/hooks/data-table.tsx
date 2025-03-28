import TableFooterDescription from "@/components/customComponents/TableFooterData"
import TopActions from "@/components/customComponents/TopActions"
import {
	Table,
	TableHead,
	TableHeader,
	TableRow,
	TableBody,
	TableCell
} from "@/components/ui/table"
import { fuzzyFilter } from "@/lib/fuzzyFilter"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	PaginationState,
	Row,
	SortingState,
	useReactTable
} from "@tanstack/react-table"
import React, { useState } from "react"

type DataTableProps<TData> = {
	columns: ColumnDef<TData>[]
	data: TData[]
	renderSubComponent?: (row: Row<TData>) => React.ReactElement
	onDelete?: (rows: Row<TData>[]) => void
}

const DataTable = <TData,>({
	columns,
	data,
	renderSubComponent,
	onDelete
}: DataTableProps<TData>) => {
	const [sorting, setIsSorting] = useState<SortingState>([])
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 1,
		pageSize: 10
	})

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setIsSorting,
		onPaginationChange: setPagination,
		state: {
			sorting,
			pagination
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: fuzzyFilter
	})

	const excelData = data.map((item: any) => {
		const { id, ...rest } = item
		return rest
	})

	return (
		<div className='mt-4'>
			<TopActions
				table={table}
				onDelete={onDelete}
				data={excelData}
			/>
			<Table className='border mb-2'>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroups) => (
						<TableRow
							key={headerGroups.id}
							className='bg-secondary sticky top-96 left-0'
						>
							{headerGroups.headers.map((header) => (
								<TableHead
									key={header.id}
									className='text-center'
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
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
							<React.Fragment key={row.id}>
								<TableRow>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className='text-center'
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
								{row.getCanExpand() && renderSubComponent ? (
									<TableRow>
										<TableCell
											colSpan={
												row.getVisibleCells().length
											}
										>
											{renderSubComponent(row)}
										</TableCell>
									</TableRow>
								) : null}
							</React.Fragment>
						))
					) : (
						<TableRow>
							<TableCell>No rows found</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{/* <div className='border'>
			</div> */}
			<TableFooterDescription table={table} />
		</div>
	)
}

export default DataTable
