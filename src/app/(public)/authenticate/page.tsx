import SignInForm from "@/components/customComponents/SignInForm"
import SignUpForm from "@/components/customComponents/SignUpForm"
import TabSwitcher from "@/components/customComponents/TabSwitcher"
import { getSession } from "@/lib/get-user"
import { redirect } from "next/navigation"

export default async function AuthenticatePage() {
	const { user } = await getSession()
	if (user) {
		return redirect("/dashboard")
	}
	return (
		<TabSwitcher
			signin={<SignInForm />}
			signup={<SignUpForm />}
			className='w-full max-w-md mx-auto'
		/>
	)
}
