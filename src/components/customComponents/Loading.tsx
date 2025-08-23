import { Loader2 } from "lucide-react"

export default function LoadingState() {
	return (
		<div className='w-full max-w-md h-full max-h-24 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-100 bg-muted rounded-md flex justify-center items-center'>
			<Loader2 className='size-8 animate-spin' />
		</div>
	)
}
