/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { DepartmentType } from "@/lib/validation";
import { useCreateDepartmentMutationFn } from "../actions/mutations";
import CreateDepartment from "../forms/create-department";

export default function CreateDepartmentDialog() {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useCreateDepartmentMutationFn();

  async function handleSubmit(data: DepartmentType) {
    try {
      await mutateAsync(data);
      onClose("create-department");
    } catch (error) {
      console.error("Failed to create department", error);
    }
  }

  const isOpen = !!dialogs["create-department"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-department")}>
      <DialogContent className="">
        <DialogHeader className="bg-background backdrop-blur-lg">
          <DialogTitle>Create A New Department</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new department
          </DialogDescription>
        </DialogHeader>
        <CreateDepartment onSubmitAction={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
