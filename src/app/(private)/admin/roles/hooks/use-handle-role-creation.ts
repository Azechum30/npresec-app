import { useTransition } from "react";
import { RoleType } from "@/lib/validation";
import {createRole} from "../actions/mutations"
import {toast} from 'sonner'
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleRoleCreation = () => {
	const [isPending, startTransition] = useTransition();
	const {onClose} = useGenericDialog()

	const handleRoleCreation = async(values: RoleType)=>{
		startTransition(async()=>{
			const result = await createRole(values);
			if(result.error){
				toast.error(result.error);
				return;
			}
			if(result.role){
				onClose("createRole")
				toast.success("Role created successfully!");
			}
		})
	}

	return {handleRoleCreation, isPending}
};