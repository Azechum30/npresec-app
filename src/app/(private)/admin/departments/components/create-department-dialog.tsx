"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateDepartment from "../forms/create-department";
import { createDepartment } from "../actions/create-department-action";
import { toast } from "sonner";
import { DepartmentType } from "@/lib/validation";
import { useDepartmentStore } from "@/hooks/use-generic-store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export default function CreateDepartmentDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { addData, deleteData, updateData } = useDepartmentStore();

  async function handleSubmit(data: DepartmentType) {
    addData(data as any);

    const resp = await createDepartment(data);

    if (resp?.error) {
      deleteData(data.code);
      toast.error(resp.error);
      return;
    }
    if (resp?.department === undefined) return;
    onClose("createDepartment");
    updateData(data.code, resp.department);
    toast.success("department created successfully!");
    return resp.department;
  }

  return (
    <Dialog
      open={dialogs["createDepartment"]}
      onOpenChange={() => onClose("createDepartment")}>
      <DialogContent className="max-h-[85vh] overflow-auto w-full scrollbar-thin">
        <DialogHeader className="bg-background backdrop-blur-lg">
          <DialogTitle>Create A New Department</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new department
          </DialogDescription>
        </DialogHeader>
        <CreateDepartment onSubmit={handleSubmit} />
        <DialogFooter>
          <DialogClose
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
