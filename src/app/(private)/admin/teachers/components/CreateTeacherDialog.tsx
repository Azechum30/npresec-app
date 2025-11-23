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
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import CreateTeacherForm from "./forms/create-teacher-form";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHandleTeacherCreation } from "../hooks/use-handle-teacher-creation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function CreateTeacherDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { handleTeacherCreation, isPending, createError, createSuccess } =
    useHandleTeacherCreation();

  const previousCreationRef = useRef<boolean>(false);
  useEffect(() => {
    const wasCreating = previousCreationRef.current;

    if (wasCreating && !isPending && createError) {
      toast.error(createError);
    }
    previousCreationRef.current = isPending;
  }, [createError, isPending]);

  useEffect(() => {
    if (createSuccess) {
      toast.success("Teacher profile created successfully");
      setTimeout(() => {
        console.log(id);
        onClose("createTeacher");
      }, 100);
    }
  }, [createSuccess, onClose]);

  return (
    <Dialog
      open={dialogs["createTeacher"] === true ? true : false}
      onOpenChange={() => {
        onClose("createTeacher");
      }}>
      <DialogContent className="w-full  max-h-[85vh] overflow-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Add a New Teacher Profile</DialogTitle>
          <DialogDescription>
            Fill the form to add a new teacher. All fields with the asterisk (*)
            are required and must be filled before submitting the form.
          </DialogDescription>
        </DialogHeader>
        <CreateTeacherForm
          onSubmit={handleTeacherCreation}
          isPending={isPending}
        />
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
