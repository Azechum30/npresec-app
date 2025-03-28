import { Row, Table } from "@tanstack/react-table"
import ColumnVisibility from "./ColumnVisibility"
import FilterSearchInput from "./FilterSearchInput"
import UploadButton from "./UploadButton"
import { ExportAsExcel } from "./ExportAsExcel"
import RowSelectionComponent from "./RowSelectionComponent"
import { cn } from "@/lib/utils"

type TopActionsProps<T> = {
	table: Table<T>
	data: T[]
	onDelete?: (rows: Row<T>[]) => void
}

export default function TopActions<T>({
	table,
	data,
	onDelete
}: TopActionsProps<T>) {
	return (
		<div
			className={cn(
				"grid  grid-col-1 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-[3fr_1fr_1fr_9.5rem] gap-y-3 sm:gap-x-3 mb-4 ",
				table.getSelectedRowModel().rows.length > 0 &&
					"lg:grid-cols-[3fr_1fr_1fr_1fr_9.5rem]"
			)}
		>
			<FilterSearchInput
				table={table}
				className='sm:col-span-3 lg:col-span-1 order-4 lg:-order-1'
			/>
			<RowSelectionComponent
				table={table}
				onDelete={onDelete}
				className=''
			/>
			<UploadButton className='' />
			<ExportAsExcel data={data as any} />
			<ColumnVisibility
				table={table}
				className='hidden lg:inline-flex'
			/>
		</div>
	)
}
