import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	ColumnDef,
	RowSelectionState,
	getFilteredRowModel,
	PaginationState,
	getPaginationRowModel,
	Row,
	SortingState,
	getSortedRowModel,
	ExpandedState,
	getExpandedRowModel
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Fragment, useState } from "react"
import { fuzzyFilter } from "@/lib/fuzzyFilter"
import TableFooterDescription from "@/components/customComponents/TableFooterData"

import TeacherRowDetail from "./TeacherRowDetail"
import TopActions from "@/components/customComponents/TopActions"

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onDelete?: (rows: Row<TData>[]) => void
}

export default function TeacherDataTable<TData, TValue>({
	columns,
	data,
	onDelete
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 1,
		pageSize: 10
	})

	const [sorting, setSorting] = useState<SortingState>([])
	const [expanded, setExpanded] = useState<ExpandedState>({})

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onExpandedChange: setExpanded,

		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: fuzzyFilter,
		state: {
			rowSelection,
			pagination,
			sorting,
			expanded
		}
	})

	const excelData = data.map((teacher: any) => {
		const { id, userId, department, ...rest } = teacher

		return {
			...rest,
			departmentId: department?.name
		}
	})

	return (
		<div className='mt-4'>
			<TopActions
				table={table}
				data={excelData}
				onDelete={onDelete}
			/>
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroups) => (
							<TableRow key={headerGroups.id}>
								{headerGroups.headers.map((header) => (
									<TableHead key={header.id}>
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
						{table.getRowModel().rows ? (
							table.getRowModel().rows.map((row) => (
								<Fragment key={row.id}>
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
									{row.getIsExpanded() && (
										<TeacherRowDetail row={row} />
									)}
								</Fragment>
							))
						) : (
							<TableBody>
								<TableCell>No Rows found!</TableCell>
							</TableBody>
						)}
					</TableBody>
				</Table>
			</div>
			<TableFooterDescription table={table} />
		</div>
	)
}
