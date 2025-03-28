"use client"

import { Button } from "@/components/ui/button"
import { useCreateDepartment } from "./use-open-create-department"
import { PlusCircle } from "lucide-react"

export default function CreateDepartmentButton() {
	const { onOpen } = useCreateDepartment()

	return (
		<Button
			className='w-full md:w-auto'
			onClick={onOpen}
		>
			<PlusCircle className='size-4' />
			Add
		</Button>
	)
}
