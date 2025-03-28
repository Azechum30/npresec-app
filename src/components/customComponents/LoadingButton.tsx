import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "../ui/button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
	loading: boolean
}
export default function LoadingButton({
	loading,
	className,
	...props
}: LoadingButtonProps) {
	return (
		<Button
			disabled={loading}
			className={cn(" w-full flex items-center gap-x-3", className)}
			{...props}
		>
			{props.children}
			{loading && <Loader2 className='size-5 animate-spin' />}
		</Button>
	)
}
