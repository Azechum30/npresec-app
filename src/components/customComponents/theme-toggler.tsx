"use client";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggler({ className }: { className: string }) {
	const setTheme = useTheme();
	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size='icon'
						className='size-6'
					>
						<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
						<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='center'>
					<DropdownMenuLabel>Themes</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => setTheme.setTheme("dark")}>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme.setTheme("light")}
					>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme.setTheme("system")}
					>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
