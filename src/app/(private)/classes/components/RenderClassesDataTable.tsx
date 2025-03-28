"use client"

import { ClassesResponseType } from "@/lib/types"
import React from "react"
import ClassesDataTable from "./data-table"
import { ClassesColumns } from "./ClassesColumns"
import LoadingState from "@/components/customComponents/Loading"
import DataTable from "@/hooks/data-table"

type RenderClassesDataTableProps = {
	initialState: ClassesResponseType[]
}

const RenderClassesDataTable: React.FC<RenderClassesDataTableProps> = ({
	initialState
}) => {
	if (!initialState) {
		return <LoadingState />
	}
	return (
		<React.Fragment>
			{/* <ClassesDataTable
				columns={ClassesColumns}
				data={initialState}
			/> */}

			<DataTable
				columns={ClassesColumns}
				data={initialState}
			/>
		</React.Fragment>
	)
}

export default RenderClassesDataTable
