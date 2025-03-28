import { getSession } from "@/lib/get-user"
import CreateDepartmentButton from "./components/CreateDepartmentButton"
import { getServerSideProps } from "./components/getServerSideProps"
import RenderDepartmentsDataTable from "./components/render-departments-datateble"
import UploadComponent from "./components/UploadComponent"
import { BulkUploadDepartmentType } from "@/lib/validation"
import { bulkUploadDepartments } from "./components/bulk-upload-action"
import DepartmentUploadProvider from "./components/DepartmentUploadProvider"

export default async function DepartmentPage() {
	const { user } = await getSession()
	if (!user) return null

	const departments = await getServerSideProps()

	return (
		<>
			<div className='flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0'>
				<h1 className='font-semibold line-clamp-1'>All Departments</h1>
				<CreateDepartmentButton />
			</div>
			<div>
				<RenderDepartmentsDataTable initialState={departments.data!} />
			</div>
			<DepartmentUploadProvider />
		</>
	)
}
