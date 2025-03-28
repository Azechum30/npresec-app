"use client"

import DataTableComponent from "@/components/customComponents/data-table"
import { Department, useStore } from "./use-department-optimistic-store"
import { useEffect, useMemo } from "react"
import { columns } from "./columns"
import { Loader2 } from "lucide-react"
import { DeleteDepartmentsType } from "@/lib/validation"
import { deleteDepartments } from "./delete-departments-action"
import { toast } from "sonner"
import { DepartmentResponseType } from "@/lib/types"

type RenderProps = {
	initialState: DepartmentResponseType[]
}

export default function RenderDepartmentsDataTable({
	initialState
}: RenderProps) {
	const { departments, setDepartments, bulkDeleteDepartment } = useStore()
	const memoizeData = useMemo(() => initialState, [initialState])

	useEffect(() => {
		setDepartments(memoizeData as any)
	}, [memoizeData, setDepartments])

	if (!initialState) {
		return (
			<span className='w-full h-screen flex justify-center items-center'>
				<Loader2 className='size-8 animate-spin' />
			</span>
		)
	}

	async function handleBulkDelete(ids: DeleteDepartmentsType) {
		bulkDeleteDepartment(ids.ids)
		const res = await deleteDepartments(ids)

		if (res.error) {
			setDepartments(memoizeData)
			return toast.error(res.error)
		}

		toast.success(`${res.count} row(s) were deleted successfully`)
	}

	return (
		<DataTableComponent
			columns={columns}
			data={departments as any}
			onDelete={async (row) => {
				const ids = row.map((r) => r.original.id as string)
				await handleBulkDelete({ ids })
			}}
		/>
	)
}
