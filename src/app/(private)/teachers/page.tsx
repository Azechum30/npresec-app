import { getTeachers } from "./actions/server"
import OpenCreateTeachersButton from "./components/OpenCreateTeachersButton"
import RenderTeacherData from "./components/Render-teacher-data"
import TeacherBulkUploadProvider from "./components/TeacherBulkUploadProvider"

export default async function TeachersPage() {
	const teachers = await getTeachers()

	if (teachers.error || teachers.teachers === undefined) return

	return (
		<>
			<div className='flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0'>
				<h1 className='font-semibold line-clamp-1'>All Teachers</h1>
				<OpenCreateTeachersButton />
			</div>
			<RenderTeacherData initialValues={teachers.teachers} />
			<TeacherBulkUploadProvider />
		</>
	)
}
