"use client"
import { usePathname } from "next/navigation"

export default function CurrentLocation() {
	const pathname = usePathname().split("/").pop()
	const transformedPath =
		pathname?.charAt(0).toUpperCase()! + pathname?.slice(1)

	return <span>{transformedPath}</span>
}
