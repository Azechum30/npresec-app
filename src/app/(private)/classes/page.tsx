import OpenDialogs from "@/components/customComponents/OpenDialogs"
import { getClassesAction } from "./actions/server-actions"
import RenderClassesDataTable from "./components/RenderClassesDataTable"
import ClassesProvider from "./components/ClassesProvider"

export default async function ClassesPage() {
	const classes = await getClassesAction()
	if (classes.error || classes.data === undefined) return

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
				<h1 className='font-medium line-clamp-1'>All Classes</h1>
				<OpenDialogs dialogKey='createClass' />
			</div>
			<RenderClassesDataTable initialState={classes.data} />
			<ClassesProvider />
		</>
	)
}
