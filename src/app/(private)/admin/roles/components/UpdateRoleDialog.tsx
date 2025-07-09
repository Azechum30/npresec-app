'use client'

import {Dialog, DialogContent, DialogFooter, DialogDescription, DialogTitle, DialogHeader, DialogClose} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState } from "react";
import { getRole } from "../actions/queries";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";
import { CreateRoleForm } from "@/app/(private)/admin/roles/forms/CreateRoleForm";
import { useHandleRoleUpdate } from "@/app/(private)/admin/roles/hooks/use-handle-role-update";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


export const UpdateRoleDialog= ()=>{
	const {id, dialogs, onClose} = useGenericDialog();

	const [role, setRole] = useState<{name: string, permissions: string[] }>();
	const [error, setError] = useState<string>("");
	useEffect( () => {

		if(!dialogs["updateRole"] || !id) return ;
		const fetchRole = async()=>{
			const result = await getRole(id as string);
			if(result.error){
				setError(result.error)
				return;
			}
			if(result.role){
				setRole({
					name: result.role.name,
					permissions: result.role.permissions?.length  ? result.role.permissions.map(perm => perm.id): []
				})
				setError("")
			}

		}
		setRole(undefined)
		setError("")
		fetchRole()

	}, [id, dialogs["updateRole"]] );

	const {isPending, handleRoleUpdate} = useHandleRoleUpdate()

	if(error){
		return toast.error(error)
	}

	return <>
		<Dialog open={dialogs['updateRole']} onOpenChange={()=> onClose("updateRole")}>
			<DialogContent className="w-full max-h-[85vh] overflow-auto scrollbar-thin">
				{role ? (
					<>
					<DialogHeader>
						<DialogTitle>Edit Role</DialogTitle>
						<DialogDescription>Kindly edit role and save in realtime</DialogDescription>
					</DialogHeader>
						<CreateRoleForm
							onSubmit={async (values)=>await handleRoleUpdate({ id: id as string, data:values})}
							defaultValues={ role }
							isPending={isPending}
							id={id}
						/>
						<DialogFooter>
							<DialogClose
								className={cn(buttonVariants({variant: "secondary"}), "w-full")}
								onClick={()=>onClose("updateRole")}
							>
								Cancel
							</DialogClose>
						</DialogFooter>
					</>
				): (
					<>
					<DialogHeader className="sr-only">
						<DialogTitle>Loading Data</DialogTitle>
						<DialogDescription>Kindly wait while data loads...</DialogDescription>
					</DialogHeader>
						<LoadingState />
					</>
				)}

			</DialogContent>
		</Dialog>
	</>
}