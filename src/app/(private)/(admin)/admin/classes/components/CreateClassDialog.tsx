"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassesType } from "@/lib/validation";
import { useGenericDialog } from "../../../../../../hooks/use-open-create-teacher-dialog";
import { createClassAction } from "../actions/server-actions";
import CreateClassForm from "../forms/create-class-form";

import { ClassesResponseType } from "@/lib/types";
import { toast } from "sonner";

export default function CreateClassDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const handleSubmit = async (values: ClassesType) => {
    const result = await createClassAction(values);
    if (result.errors) {
      return { errors: result.errors };
    } else if (result.prismaErrors) {
      toast.error(result.prismaErrors?.join("\n"));
      result.prismaErrors = [];
    } else if (result.error) {
      toast.error(result.error);
      result.error = "";
    } else if (result.class) {
      toast.success("class created successfully!");
      setTimeout(() => onClose("createClass"), 300);
      result.class = {} as ClassesResponseType;
    }
  };

  return (
    <Dialog
      open={dialogs["createClass"]}
      onOpenChange={() => onClose("createClass")}>
      {dialogs["createClass"] && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Class</DialogTitle>
            <DialogDescription>
              Fill the form to create a new class group
            </DialogDescription>
          </DialogHeader>
          <CreateClassForm onSubmit={handleSubmit} />
        </DialogContent>
      )}
    </Dialog>
  );
}
