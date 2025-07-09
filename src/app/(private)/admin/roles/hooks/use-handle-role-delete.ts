import {useTransition} from 'react'
import {deleteRole} from "@/app/(private)/admin/roles/actions/mutations";
import {toast} from 'sonner'

export const useHandleRoleDelete = ()=> {
	const [isPending, startTransition] = useTransition()

	const handleRoleDelete = async(id:string)=>{
		startTransition(async()=>{
			const result = await deleteRole(id);

			if(result.error){
				toast.error(result.error)
				return;
			}

			if(result.role){
				toast.success("Role deleted successfully!");
			}
		})
	}

	return {isPending, handleRoleDelete}
}