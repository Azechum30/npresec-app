"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "../ui/tooltip"

export default function LinkWithStyles({
	href,
	title,
	className,
	icon
}: {
	href: string
	title: string
	className?: string
	icon?: React.ReactNode
}) {
	const pathname = usePathname()
	return (
		<Link
			href={href}
			className={cn(
				icon &&
					"flex items-center gap-x-4 sm:gap-x-1 lg:gap-x-4 w-fit h-[52px] md:h-auto md:w-full",
				className,
				href === pathname && !icon && "text-blue-400",
				href === pathname && icon && "bg-gray-300 dark:bg-gray-800"
			)}
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger
						className={cn(
							"flex items-center gap-x-4 sm:gap-x-1 lg:gap-x-4 w-fit h-full md:w-full",
							href === pathname && !icon && "text-blue-400",
							href === pathname &&
								icon &&
								"bg-gray-300 dark:bg-gray-800"
						)}
					>
						<span
							className={cn(
								"hidden size-5",
								icon && "inline-flex"
							)}
						>
							{icon}
						</span>
						<span className='hidden md:inline-flex'>{title}</span>
					</TooltipTrigger>
					<TooltipContent>{`Link to ${title} page`}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</Link>
	)
}
