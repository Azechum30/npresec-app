"use client"
import {
	BookOpen,
	GraduationCap,
	Home,
	LayoutDashboard,
	LucideBuilding2,
	UserPen
} from "lucide-react"
import LinkWithStyles from "./LinkWithStyles"
import UserButton from "./UserButton"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { useOpenSidebar } from "@/hooks/use-open-sidebar"
import { useRef, useEffect } from "react"

export const Links = [
	{
		section: "User Management",
		Links: [
			{
				title: "Overview",
				href: "/dashboard",
				icon: <LayoutDashboard />
			},
			{
				title: "Students",
				href: "/students",
				icon: <GraduationCap />
			},
			{
				title: "Teachers",
				href: "/teachers",
				icon: <UserPen />
			}
		]
	},
	{
		section: "Class Management",
		Links: [
			{
				title: "Classes",
				href: "/classes",
				icon: <LucideBuilding2 />
			},
			{
				title: "Departments",
				href: "/departments",
				icon: <Home />
			},
			{
				title: "Courses",
				href: "/courses",
				icon: <BookOpen />
			}
		]
	}
]
export default function Sidebar() {
	const { open } = useOpenSidebar()

	return (
		<div
			className={cn(
				"inset-[68px] bg-inherit sticky top-0 left-0 z-30 h-screen border-r aside backdrop-blur",
				open && "open"
			)}
		>
			<div className='w-fit md:w-full flex flex-col items-center md:items-start gap-y-4 relative h-full sidebar-content'>
				<div
					className={cn(
						`${buttonVariants({
							variant: "outline"
						})} backdrop-blur-sm w-fit md:w-full px-4 py-2 text-left justify-center md:justify-start flex gap-x-3 rounded-none items-center h-14 sticky top-0 left-0 z-30 border-0 border-b`
					)}
				>
					<Avatar className='backdrop-blur-sm'>
						<AvatarImage src='/logo.png' />
						<AvatarFallback>NP</AvatarFallback>
					</Avatar>
					<h1 className='hidden md:block text-base font-semibold'>
						NPRESEC
					</h1>
				</div>
				{Links.map((link) => (
					<div
						key={link.section}
						className=' w-fit md:w-full flex flex-col items-center md:items-start gap-y-3 px-4 sm:px-2 lg:px-4'
					>
						<span className=' hidden md:block text-sm'>
							{link.section}
						</span>
						<div className='w-fit md:w-full'>
							{link.Links.map((innerLink) => (
								<LinkWithStyles
									key={innerLink.href}
									title={innerLink.title}
									href={innerLink.href}
									icon={innerLink.icon}
									className='mt-1 p-4 md:px-4 lg:px-4 md:py-2 text-muted-foreground hover:text-inherit hover:bg-gray-300 dark:hover:bg-gray-800 text-sm rounded-full md:rounded-md first:mt-0'
								/>
							))}
						</div>
					</div>
				))}
				<div className='sticky bottom-0 left-0 z-30 h-14 border-t w-fit md:w-full'>
					<UserButton />
				</div>
			</div>
		</div>
	)
}
