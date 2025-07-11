"use client"

import React, { useState } from "react"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className='relative'>
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pe-10", className)}
				ref={ref}
				{...props}
			/>
			<button
				type='button'
				onClick={() => setShowPassword((prev) => !prev)}
				className='absolute right-4 top-1/2 -translate-y-1/2 transform text-muted-foregroud '
			>
				{showPassword ? (
					<EyeOff className='size-4 text-gray-400 dark:text-gray-200' />
				) : (
					<Eye className='size-4 text-gray-400 dark:text-gray-200' />
				)}
			</button>
		</div>
	)
})

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
