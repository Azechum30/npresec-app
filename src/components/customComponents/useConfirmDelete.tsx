"use client"
import { JSX, useState } from "react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogAction
} from "@/components/ui/alert-dialog"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

type ConfirmDeleteProps = {
	ConfirmDeleteComponent: () => React.ReactNode
	confirmDelete: () => Promise<boolean>
}

export const useConfirmDelete = (
	title?: string,
	description?: string
): ConfirmDeleteProps => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [resolve, setResolve] = useState<(value: boolean) => void>()

	const confirmDelete = (): Promise<boolean> => {
		setIsOpen(true)
		return new Promise((resolve) => {
			setResolve(() => resolve)
		})
	}

	const handleConfirm = () => {
		if (resolve) resolve(true)
		setIsOpen(false)
	}

	const handleCancel = () => {
		if (resolve) resolve(false)
		setIsOpen(false)
	}

	const pathname = usePathname().split("/").pop()

	const ConfirmDeleteComponent = () => {
		return (
			<AlertDialog
				open={isOpen}
				onOpenChange={handleCancel}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{title ? title : "Are you sure?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{description
								? description
								: `You are about to perform an irreversible operation! Continuing with this action would result in a permanent removal of the selected data record(s) from the ${pathname} module. `}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={handleConfirm}
							className={cn(
								buttonVariants({ variant: "destructive" })
							)}
						>
							Continue
						</AlertDialogAction>
						<AlertDialogCancel onClick={handleCancel}>
							Cancel
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	}

	return { ConfirmDeleteComponent, confirmDelete }
}
