"use client"
import { useOpenCommandPalette } from "@/hooks/use-open-command-palette"
import { Button, buttonVariants } from "../ui/button"
import { Command } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CommandButton() {
	const { onOpen } = useOpenCommandPalette()

	return (
		<Button
			variant='outline'
			onClick={onOpen}
			className='relative md:w-auto w-[300px] lg:w-[300px] py-2 flex items-center justify-between text-muted-foreground hover:text-inherit'
		>
			<span>Search the system...</span>
			<span
				className={cn(
					`md:hidden absolute top-1/2 right-1 -translate-y-1/2 z-40 flex lg:flex items-center text-xs bg-gray-300 hover:bg-inherit dark:bg-gray-700/75 dark:hover:bg-inherit rounded-md px-2 py-1`
				)}
			>
				<Command className='size-1 mr-1' />
				<span>K</span>
			</span>
		</Button>
	)
}
