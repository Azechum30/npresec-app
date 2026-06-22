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
import type { StaffType } from "@/lib/validation";
import { useCreateStaffMutationFn } from "../actions/mutations";
import CreateStaffForm from "./forms/create-staff-form";

export default function CreateStaffDialog() {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useCreateStaffMutationFn();

  const handleStaffCreation = (data: StaffType) =>
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-staff");
    });

  const isOpen = !!dialogs["create-staff"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose("create-staff");
      }}>
      <DialogContent className="md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add a new Staff</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new staff profile
          </DialogDescription>
        </DialogHeader>
        <CreateStaffForm
          onSubmitAction={handleStaffCreation}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
