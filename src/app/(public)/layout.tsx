import Navbar from "@/components/customComponents/Navbar"
import { ReactNode } from "react"

export default function PublicLayout({
	children
}: {
	readonly children: ReactNode
}) {
	return (
		<div className='relative h-screen'>
			<Navbar />
			<div className='w-full p-6 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
				{children}
			</div>
		</div>
	)
}
