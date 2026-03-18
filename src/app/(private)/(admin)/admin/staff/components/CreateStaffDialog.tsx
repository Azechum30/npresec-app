"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useHandleStaffCreation } from "../hooks/use-handle-staff-creation";
import CreateStaffForm from "./forms/create-staff-form";

export default function CreateStaffDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { handleStaffCreation, isPending, createError, createSuccess } =
    useHandleStaffCreation();

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
      toast.success("Staff profile created successfully");
      setTimeout(() => {
        onClose("createStaff");
      }, 100);
    }
  }, [createSuccess, onClose]);

  return (
    <Dialog
      open={dialogs["createStaff"] === true ? true : false}
      onOpenChange={() => {
        onClose("createStaff");
      }}>
      <DialogContent className="md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add a new Staff</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new staff profile
          </DialogDescription>
        </DialogHeader>
        <CreateStaffForm onSubmit={handleStaffCreation} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
