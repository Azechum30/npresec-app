"use client"
import { useOpenCommandPalette } from "@/hooks/use-open-command-palette"
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "../ui/command"
import { Links } from "./Sidebar"
import { useRouter } from "next/navigation"
import { File } from "lucide-react"

export default function CommandPalette() {
	const { open, onClose } = useOpenCommandPalette()
	const router = useRouter()

	const handleCommand = (value: string) => {
		onClose()
		router.push(value)
	}

	return (
		<CommandDialog
			open={open}
			onOpenChange={onClose}
		>
			<CommandInput placeholder='Type A Command or Search...' />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{Links.map((link) => (
					<CommandGroup
						key={link.section}
						heading={link.section}
					>
						{link.Links.map((innerLink) => (
							<CommandItem
								key={innerLink.href}
								onSelect={() => handleCommand(innerLink.href)}
							>
								<File className='size-4' />
								{innerLink.title}
							</CommandItem>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</CommandDialog>
	)
}
