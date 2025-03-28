"use client"

import { TeacherResponseType } from "@/lib/types"
import { useTeacherStore } from "../hooks/use-teacher-store"
import TeacherDataTable from "./data-table"
import { TeacherColumns } from "./TeacherColumns"
import { useEffect, useMemo } from "react"
import LoadingState from "@/components/customComponents/Loading"
import { bulkDeleteTeachers } from "../actions/server"
import { toast } from "sonner"

type Props = {
	initialValues: TeacherResponseType[]
}

export default function RenderTeacherData({ initialValues }: Props) {
	const { intialState, setTeachers } = useTeacherStore()

	const memoizedData = useMemo(() => initialValues, [initialValues])

	useEffect(() => {
		setTeachers(memoizedData)
	}, [memoizedData, setTeachers])

	if (!memoizedData) {
		return <LoadingState />
	}

	const handleBulkDelete = async (rows: string[]) => {
		const res = await bulkDeleteTeachers(rows)
		if ("error" in res) {
			toast.error(res.error)
		} else {
			toast.success(
				`${res.count} teacher(s) records were deleted successfully!`
			)
		}
	}

	return (
		<>
			<TeacherDataTable
				columns={TeacherColumns}
				data={intialState}
				onDelete={async (rows) => {
					const ids = rows.map((row) => row.original.id)
					await handleBulkDelete(ids)
				}}
			/>
		</>
	)
}
