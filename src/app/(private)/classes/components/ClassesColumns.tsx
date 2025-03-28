import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ClassesResponseType } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDownUp, ArrowUpDown } from "lucide-react"
import moment from "moment"

export const ClassesColumns = [
	{
		id: "rowSelection",
		header: ({ table }) => {
			return (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={() => table.toggleAllPageRowsSelected()}
				/>
			)
		},

		cell: ({ row }) => {
			return (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={() => row.toggleSelected()}
				/>
			)
		},

		enableHiding: false,
		enablePinning: false,
		enableSorting: false
	},
	{
		header: ({ column }) => {
			return (
				<Button
					className='justify-start text-sm'
					variant={column.getIsSorted() ? "secondary" : "ghost"}
					size='sm'
					onClick={() => column.toggleSorting()}
				>
					<span>ClassCode</span>
					{column.getIsSorted() ? (
						<ArrowUpDown className='size-5' />
					) : (
						<ArrowDownUp className='size-5' />
					)}
				</Button>
			)
		},
		accessorKey: "code"
	},
	{
		header: ({ column }) => {
			return (
				<Button
					className='justify-start text-sm'
					variant={column.getIsSorted() ? "secondary" : "ghost"}
					size='sm'
					onClick={() => column.toggleSorting()}
				>
					<span>ClassName</span>
					{column.getIsSorted() ? (
						<ArrowUpDown className='size-5' />
					) : (
						<ArrowDownUp className='size-5' />
					)}
				</Button>
			)
		},
		accessorKey: "name"
	},
	{
		header: "Department",
		accessorKey: "departmentId",
		cell: ({ row }) => {
			return `${row.original.department?.name}`
		}
	},
	{
		header: "YearLevel",
		accessorKey: "level",
		cell: ({ row }) => {
			return row.original.level.split("_").join(" ")
		}
	},
	{
		header: "CreatedAt",
		accessorKey: "createdAt",
		cell: ({ row }) => {
			return moment(row.original.createdAt).format("DDD/MM/YY")
		}
	}
] satisfies ColumnDef<ClassesResponseType>[]
