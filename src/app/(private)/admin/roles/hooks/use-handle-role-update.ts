import {useTransition} from "react";
import { UpdateRoleType } from "@/lib/validation";
import { updateRole } from "@/app/(private)/admin/roles/actions/mutations";
import { toast } from "sonner"
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleRoleUpdate = ()=>{
	const [isPending, startTransition] = useTransition();
	const {onClose} = useGenericDialog()

	const handleRoleUpdate = async(values: UpdateRoleType)=>{
		startTransition(async()=>{
			const result = await updateRole(values);
			if(result.error){
				toast.error(result.error);
				return;
			}
			if(result.role){
				onClose("updateRole")
				toast.success("Role updated successfully")
			}
		})
	}

	return {isPending, handleRoleUpdate}
}