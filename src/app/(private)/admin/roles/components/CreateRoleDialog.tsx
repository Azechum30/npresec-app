'use client'

import {Dialog, DialogContent, DialogFooter, DialogClose, DialogTitle, DialogHeader, DialogDescription} from '@/components/ui/dialog'
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { CreateRoleForm } from "@/app/(private)/admin/roles/forms/CreateRoleForm";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHandleRoleCreation } from "@/app/(private)/admin/roles/hooks/use-handle-role-creation";

export const CreateRoleDialog = () => {
	const {dialogs, onClose} = useGenericDialog();
	const {isPending, handleRoleCreation} = useHandleRoleCreation()
	return (
		<>
			<Dialog open={dialogs["createRole"]} onOpenChange={() => onClose("createRole")}>
				<DialogContent className="w-full md:max-h-[85vh] overflow-auto scrollbar-thin">
					<DialogHeader>
						<DialogTitle>Create Role</DialogTitle>
						<DialogDescription>Kindly create a new role by filling the form and saving!</DialogDescription>
					</DialogHeader>
					<>
						<CreateRoleForm
							onSubmit={(values)=>handleRoleCreation(values)}
							isPending={isPending}
						/>
					</>
					<DialogFooter>
						<DialogClose
							className={cn(buttonVariants({variant: "secondary"}), "w-full")}
							onClick={()=> onClose("createRole")}
						>Cancel</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}