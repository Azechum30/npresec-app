import { useEffect, useState } from "react";

export const useDebounce = (role: string, delay:number=100) => {
	const [debouncedRole, setDebouncedRole] = useState(role);

	useEffect(()=>{
		const handler = setTimeout(()=>{
			setDebouncedRole(role)
		}, delay)

		return ()=> clearTimeout(handler)
	},[role, delay]);

	return debouncedRole;
};