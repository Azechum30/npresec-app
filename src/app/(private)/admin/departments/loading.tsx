import { Loader2 } from "lucide-react"

export default function Loading() {
	return (
		<span className='w-full h-screen flex justify-center items-center'>
			<Loader2 className='size-4 animate-spin' />
		</span>
	)
}
