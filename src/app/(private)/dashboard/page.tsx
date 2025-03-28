import { getSession } from "@/lib/get-user"
import { redirect } from "next/navigation"

export default async function DashboardOverviewPage() {
	const user = await getSession()
	if (user === null || user === undefined) return redirect("/authenticate")
	return <div>Dashboard overview page</div>
}
