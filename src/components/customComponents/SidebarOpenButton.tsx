"use client"

import { useOpenSidebar } from "@/hooks/use-open-sidebar"
import { Button } from "../ui/button"
import { AlignJustify } from "lucide-react"

export default function SidebarOpenButton() {
	const { open, setOpen } = useOpenSidebar()

	const handleOpen = (value: boolean) => {
		setOpen(value)
	}
	return (
		<Button
			onClick={() => handleOpen(open)}
			variant='outline'
			size='sm'
		>
			<AlignJustify className='pointer-events-none' />
		</Button>
	)
}
