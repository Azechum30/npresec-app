"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateDepartment from "../forms/create-department";
import { createDepartment } from "../actions/create-department-action";
import { toast } from "sonner";
import { DepartmentType } from "@/lib/validation";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export default function CreateDepartmentDialog() {
  const { dialogs, onClose } = useGenericDialog();

  async function handleSubmit(data: DepartmentType) {
    const resp = await createDepartment(data);

    if (resp?.error) {
      toast.error(resp.error);
      return;
    }
    if (resp?.department === undefined) return;
    toast.success("department created successfully!");

    setTimeout(() => onClose("createDepartment"), 100);
  }

  return (
    <Dialog
      open={dialogs["createDepartment"] === true ? true : false}
      onOpenChange={() => onClose("createDepartment")}>
      <DialogContent className="max-h-[85vh] overflow-auto w-full scrollbar-thin">
        <DialogHeader className="bg-background backdrop-blur-lg">
          <DialogTitle>Create A New Department</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new department
          </DialogDescription>
        </DialogHeader>
        <CreateDepartment onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
