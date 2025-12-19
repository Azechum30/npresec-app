"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateClassForm from "../forms/create-class-form";
import { useGenericDialog } from "../../../../../../hooks/use-open-create-teacher-dialog";
import { ClassesType } from "@/lib/validation";
import { createClassAction } from "../actions/server-actions";

import { toast } from "sonner";

export default function CreateClassDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const handleSubmit = async (values: ClassesType) => {
    const { error, errors, prismaErrors } = await createClassAction(values);
    if (errors) {
      return { errors };
    } else if (prismaErrors) {
      toast.error(prismaErrors?.join("\n"));
    } else if (error) {
      toast.error(error);
    } else {
      toast.success("class created successfully!");
      setTimeout(() => onClose("createClass"), 300);
    }
  };

  return (
    <Dialog
      open={dialogs["createClass"]}
      onOpenChange={() => onClose("createClass")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Class</DialogTitle>
          <DialogDescription>
            Fill the form to create a new class group
          </DialogDescription>
        </DialogHeader>
        <CreateClassForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
