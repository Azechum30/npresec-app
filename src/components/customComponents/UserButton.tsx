"use client"

import { Button } from "../ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import LogoutButton from "./LogoutButton"
import {
	Check,
	Laptop2,
	Loader2,
	Monitor,
	Moon,
	Settings,
	Sun
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useGetSession } from "./SessionProvider"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function UserButton() {
	const { user } = useGetSession()

	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					className='w-fit md:w-full h-full flex justify-center md:justify-start text-left rounded-none py-2 items-center gap-x-3 border-0 backdrop-blur-sm'
				>
					<Avatar className='backdrop-blur-sm'>
						<AvatarImage src={user?.picture!} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					{!user ? (
						<Loader2 className='size-4 animate-spin' />
					) : (
						<span className=' hidden  md:flex flex-col'>
							<span className='font-semibold'>
								{user.username}
							</span>
							<span className='sm:hidden lg:inline-block text-xs text-muted-foreground'>
								{user.email}
							</span>
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='end'
				alignOffset={-150}
			>
				<DropdownMenuItem>
					<Link
						href={`/users/${user.id}`}
						className='flex items-center gap-x-2'
					>
						<Avatar>
							<AvatarImage src={user?.picture!} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<span className='flex flex-col'>
							<span className='font-semibold'>
								{user.username}
							</span>
							<span className='text-xs text-muted-foreground'>
								{user.email}
							</span>
						</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Button
							variant='ghost'
							size='sm'
							className='w-full flex justify-start items-center text-sm'
						>
							<Monitor className='size-4 mr-2' />
							Theme
						</Button>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								onClick={() => setTheme("system")}
							>
								<Laptop2 className='size-4 mr-2' />
								System
								{theme === "system" && (
									<Check className='size-4' />
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setTheme("light")}>
								<Sun className='size-4 mr-2' />
								Light
								{theme === "light" && (
									<Check className='size-4' />
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								<Moon className='size-4 mr-2' />
								Dark
								{theme === "dark" && (
									<Check className='size-4' />
								)}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='ps-5'>
					<Settings className='size-4 mr-3' />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<LogoutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
