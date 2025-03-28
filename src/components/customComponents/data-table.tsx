"use client"

import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	ColumnDef,
	VisibilityState,
	SortingState,
	getSortedRowModel,
	Row,
	PaginationState,
	getPaginationRowModel,
	getFilteredRowModel,
	ExpandedState,
	getExpandedRowModel,
	ColumnPinningState
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import ColumnVisibility from "./ColumnVisibility"
import React, { useState } from "react"
import { ExportAsExcel } from "./ExportAsExcel"
import { fuzzyFilter } from "@/lib/fuzzyFilter"
import FilterSearchInput from "./FilterSearchInput"
import { cn } from "@/lib/utils"
import RowDetailedComponent from "./RowDetailComponent"
import TableFooterDescription from "./TableFooterData"
import RowSelectionComponent from "./RowSelectionComponent"
import UploadButton from "./UploadButton"
import { Button } from "../ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Pin, PinOff } from "lucide-react"
import TopActions from "./TopActions"
import moment from "moment"
import { DepartmentResponseType } from "@/lib/types"

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onDelete?: (row: Row<TData>[]) => void
}

export default function DataTableComponent<TData, TValue>({
	columns,
	data,
	onDelete
}: DataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	)
	const [sorting, setSorting] = useState<SortingState>([])
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 1,
		pageSize: 10
	})

	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({})
	const table = useReactTable({
		columns,
		data,
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		onExpandedChange: setExpanded,
		onColumnPinningChange: setColumnPinning,
		state: {
			columnVisibility,
			sorting,
			pagination,
			expanded,
			columnPinning
		},
		enableColumnPinning: true
	})

	const departmentsData = data.map((department: any) => {
		const { id, head, description, ...rest } = department

		return {
			...rest,
			headId: head
				? `${head?.lastName} ${head?.firstName} ${head?.middleName}`
				: ""
		}
	})

	return (
		<div className='mt-3'>
			<TopActions
				table={table}
				onDelete={onDelete}
				data={departmentsData}
			/>
			<div className='rounded-md border'>
				<Table className='table table-auto'>
					<TableHeader>
						{table.getHeaderGroups().map((headers) => (
							<TableRow key={headers.id}>
								{headers.headers.map((header) => (
									<TableHead
										key={header.id}
										className={cn(
											header.column.getIsPinned() &&
												"bg-primary/50"
										)}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}

										{header.column.getCanPin() && (
											<>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant='ghost'
															size='sm'
															className='ml-2 justify-start text-left'
														>
															{header.column.getIsPinned() ? (
																<PinOff className='size-4' />
															) : (
																<Pin className='size-4' />
															)}
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuLabel className='text-xs'>
															Pinning Options
														</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																header.column.pin(
																	"left"
																)
															}
														>
															Left
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																header.column.pin(
																	"right"
																)
															}
														>
															Right
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																header.column.pin(
																	false
																)
															}
														>
															Unpin
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
									<TableRow
										className={cn(
											row.getIsSelected() && "bg-muted/50"
										)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className=''
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
									{row.getIsExpanded() ? (
										<TableRow>
											<TableCell
												colSpan={
													row.getVisibleCells().length
												}
											>
												<RowDetailedComponent
													row={row.original}
												/>
											</TableCell>
										</TableRow>
									) : null}
								</React.Fragment>
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
