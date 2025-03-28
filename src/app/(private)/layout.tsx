import { ReactNode } from "react"
import Sidebar from "@/components/customComponents/Sidebar"
import MainContainer from "@/components/customComponents/MainContainer"
import CreateDepartmentDialog from "./departments/components/create-department-dialog"
import EditDepartment from "./departments/components/EditDepartment"
import SessionProvider from "@/components/customComponents/SessionProvider"
import { getSession } from "@/lib/get-user"
import { redirect } from "next/navigation"
import CreateTeacherDialog from "./teachers/components/CreateTeacherDialog"
import EditTeacherDialog from "./teachers/components/EditTeacherDialog"
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider"
import CreateClassDialog from "./classes/components/CreateClassDialog"

export default async function PrivateRoutesLayout({
	children
}: {
	readonly children: ReactNode
}) {
	const { user, session } = await getSession()

	if (!user) return redirect("/authenticate")
	return (
		<SessionProvider value={{ user, session }}>
			<TanstackQueryProvider>
				<main className='w-full flex transition-all duration-300 ease'>
					<Sidebar />
					<CreateDepartmentDialog />
					<CreateTeacherDialog />
					<CreateClassDialog />
					<EditDepartment />
					<EditTeacherDialog />
					<MainContainer>{children}</MainContainer>
				</main>
			</TanstackQueryProvider>
		</SessionProvider>
	)
}
