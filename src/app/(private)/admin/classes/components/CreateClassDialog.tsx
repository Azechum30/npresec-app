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
import CreateClassForm from "../forms/create-class-form";
import { useGenericDialog } from "../../../../../hooks/use-open-create-teacher-dialog";
import { ClassesType } from "@/lib/validation";
import { createClassAction } from "../actions/server-actions";

import { toast } from "sonner";
import { useClassesStore } from "@/hooks/use-generic-store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function CreateClassDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { addData, deleteData, updateData } = useClassesStore();

  const handleSubmit = async (values: ClassesType) => {
    addData(values as any);
    const res = await createClassAction(values);
    if (res !== undefined && "errors" in res) {
      deleteData(values.code);
      return { errors: res.errors };
    } else if (res !== undefined && res.class) {
      onClose("createClass");
      updateData(res.class.code, res.class);
      toast.success("Class created successfully");
      return res.class;
    } else if (res !== undefined && "prismaErrors" in res) {
      deleteData(values.code);
      toast.error(res.prismaErrors?.join("\n"));
    } else {
      deleteData(values.code);
      toast.error(res.error);
    }
  };

  return (
    <Dialog
      open={dialogs["createClass"]}
      onOpenChange={() => onClose("createClass")}>
      <DialogContent className="h-full w-full">
        <DialogHeader>
          <DialogTitle>Create a New Class</DialogTitle>
          <DialogDescription>
            Fill the form to create a new class group
          </DialogDescription>
        </DialogHeader>
        <CreateClassForm onSubmit={handleSubmit} />
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
