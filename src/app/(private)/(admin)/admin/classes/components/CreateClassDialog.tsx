"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClassesType } from "@/lib/validation";
import { useGenericDialog } from "../../../../../../hooks/use-open-create-teacher-dialog";
import { useCreateClassMutationFn } from "../actions/mutations";
import CreateClassForm from "../forms/create-class-form";

export default function CreateClassDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useCreateClassMutationFn();

  const isOpen = !!dialogs["create-class"];

  const handleSubmit = (values: ClassesType) =>
    Promise.try(async () => {
      await mutateAsync(values);
      onClose("create-class");
    });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-class")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Class</DialogTitle>
          <DialogDescription>
            Fill the form to create a new class group
          </DialogDescription>
        </DialogHeader>
        <CreateClassForm onSubmitAction={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
