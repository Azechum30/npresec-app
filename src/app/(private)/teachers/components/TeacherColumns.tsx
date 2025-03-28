import { Checkbox } from "@/components/ui/checkbox"
import { TeacherResponseType } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import TeacherActions from "./TeacherActions"
import { Button } from "@/components/ui/button"
import { ArrowDownUp, ArrowUpDown, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export const TeacherColumns = [
	{
		header: ({ table }) => {
			return (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={() => table.toggleAllPageRowsSelected()}
				/>
			)
		},
		id: "visibility",
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
		enableSorting: false,
		enableColumnFilter: false
	},
	{
		header: "EmployeeID",
		accessorKey: "employeeId"
	},
	{
		header: ({ column }) => {
			return (
				<Button
					variant={column.getIsSorted() ? "secondary" : "ghost"}
					size='sm'
					onClick={() => column.toggleSorting()}
					className={cn("text-sm")}
				>
					{column.getIsSorted() ? <ArrowDownUp /> : <ArrowUpDown />}
					<span>FirstName</span>
				</Button>
			)
		},
		accessorKey: "firstName"
	},
	{
		header: ({ column }) => {
			return (
				<Button
					variant={column.getIsSorted() ? "secondary" : "ghost"}
					size='sm'
					onClick={() => column.toggleSorting()}
					className={cn("text-sm")}
				>
					{column.getIsSorted() ? <ArrowDownUp /> : <ArrowUpDown />}
					<span>MiddleName</span>
				</Button>
			)
		},
		accessorKey: "middleName"
	},
	{
		header: ({ column }) => {
			return (
				<Button
					variant={column.getIsSorted() ? "secondary" : "ghost"}
					size='sm'
					onClick={() => column.toggleSorting()}
					className={cn("text-sm")}
				>
					{column.getIsSorted() ? <ArrowDownUp /> : <ArrowUpDown />}
					<span>LastName</span>
				</Button>
			)
		},
		accessorKey: "lastName"
	},
	{
		header: "BirthDate",
		accessorKey: "birthDate",
		cell: ({ row }) => {
			return moment(row.original.birthDate).format("DD/MM/YY")
		}
	},
	{
		header: "Gender",
		accessorKey: "gender"
	},
	{
		header: "Department",
		accessorKey: "departmentId",
		cell: ({ row }) => {
			return row.original.department?.name
		}
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			return (
				<TeacherActions
					id={row.original.id}
					employeeId={row.original.employeeId}
				/>
			)
		},
		enableColumnFilter: false,
		enableHiding: false,
		enablePinning: false,
		enableSorting: false
	},
	{
		id: "expansion",
		header: ({ table }) => {
			return (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => table.toggleAllRowsExpanded()}
				>
					{table.getIsAllRowsExpanded() ? <Minus /> : <Plus />}
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => row.toggleExpanded()}
				>
					{row.getIsExpanded() ? <Minus /> : <Plus />}
				</Button>
			)
		},
		enableGlobalFilter: false,
		enableHiding: false,
		enablePinning: false,
		enableSorting: false
	}
] satisfies ColumnDef<TeacherResponseType>[]
