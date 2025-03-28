import { ColumnDef } from "@tanstack/react-table"
import DepartmentActions from "./DepartmentAction"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Minus, Plus } from "lucide-react"
import { DepartmentResponseType } from "@/lib/types"
import moment from "moment"

export const columns = [
	{
		id: "select",
		header: ({ table }) => {
			return (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={() => table.toggleAllPageRowsSelected()}
					className='rounded-full'
				/>
			)
		},

		cell: ({ row }) => {
			return (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={() => row.toggleSelected()}
					className='rounded-full'
				/>
			)
		},

		enableHiding: false,
		enableColumnFilter: false,
		enablePinning: false
	},

	{
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					className='capitalize text-sm justify-start text-left'
					size='sm'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					<ArrowUpDown className='size-4' />
					{column.id}
				</Button>
			)
		},
		accessorKey: "code"
	},
	{
		header: ({ column }) => {
			return (
				<Button
					size='sm'
					variant='ghost'
					className='capitalize text-sm'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					<ArrowUpDown className='size-4' />
					{column.id}
				</Button>
			)
		},
		accessorKey: "name"
	},
	{
		header: "CreatedAt",
		accessorKey: "createdAt",
		cell: ({ getValue }) => {
			return moment(getValue() as string).format("Do MMMM YY")
		}
	},
	{
		header: "Head",
		accessorKey: "headId",
		cell: ({ row }) => {
			return (
				(row.original.head?.firstName ||
					row.original.head?.middleName ||
					row.original.head?.lastName) &&
				`${row.original.head?.firstName} ${row.original.head?.middleName} ${row.original.head?.lastName}`
			)
		}
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			const id = row.original.id
			return (
				<DepartmentActions
					id={id}
					code={row.original.code}
				/>
			)
		}
	},
	{
		header: ({ table }) => {
			return (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => table.toggleAllRowsExpanded()}
				>
					{table.getIsAllRowsExpanded() ? (
						<Minus className='size-5' />
					) : (
						<Plus className='size-5' />
					)}
				</Button>
			)
		},
		id: "expand",
		cell: ({ row }) => {
			return (
				<Button
					variant='ghost'
					size='sm'
					className='cursor-pointer'
					onClick={() => row.toggleExpanded()}
				>
					{row.getIsExpanded() ? (
						<Minus className='size-5' />
					) : (
						<Plus className='size-5' />
					)}
				</Button>
			)
		},
		enableHiding: false,
		enablePinning: false,
		enableColumnFilter: false
	}
] satisfies ColumnDef<DepartmentResponseType>[]
