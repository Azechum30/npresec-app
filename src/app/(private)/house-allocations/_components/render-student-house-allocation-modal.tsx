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
import type { StudentHouseAllocationType } from "@/lib/validation";
import { useCreateAllocationMutationFn } from "../_actions/mutations";
import { StudentHouseAllocationForm } from "../_forms/student-house-allocation-form";

export const StudentHouseAllocationModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useCreateAllocationMutationFn();

  const handleAllocationCreateion = async (
    values: StudentHouseAllocationType,
  ) => {
    console.log(values);
    await Promise.try(async () => {
      await mutateAsync(values);
      onClose("create-allocation");
    });
  };

  const isOpen = !!dialogs["create-allocation"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-allocation")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create House Allocation</DialogTitle>
          <DialogDescription>
            Allocate a student to a house by filling the form below
          </DialogDescription>
        </DialogHeader>

        <StudentHouseAllocationForm
          onSubmitAction={handleAllocationCreateion}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
