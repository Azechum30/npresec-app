import React from "react"
import { getAuthUser } from "@/lib/getAuthUser";
import { hasPermissions } from "@/lib/hasPermission";

type PermissionGuardProps = {
	permission: string | string[]
	children: React.ReactNode
	fallback?: React.ReactNode
}

export default async function PermissionGuard({
	permission,
	children,
	fallback = null,
}: PermissionGuardProps) {
	const[session, permissions] = await Promise.all([getAuthUser(), hasPermissions(permission)]);

	if(session?.role?.name !== "admin" || !permissions ){
		return fallback
	}
	return <>{children}</>
}