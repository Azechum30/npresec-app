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
import { CreateBoardMemberForm } from "../_forms/create-boader-member";
import { buttonVariants } from "@/components/ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useHandleBoardMemberCreation } from "../_hooks/use-handle-board-member-creation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const CreateBoardMemberDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { handleBoardMemberCreation, isCreating, createError, createSuccess } =
    useHandleBoardMemberCreation();
  const previousCreationRef = useRef<boolean>(false);

  useEffect(() => {
    const wasCreating = previousCreationRef.current;
    if (wasCreating && !isCreating && createError) {
      toast.error(createError);
    }
  }, [createError]);

  useEffect(() => {
    if (createSuccess) {
      toast.success("Board member added successfully");
      setTimeout(() => {
        onClose("create-board-member");
      }, 100);
    }
  }, [createSuccess, onClose]);

  return (
    <>
      <Dialog
        open={dialogs["create-board-member"] === true ? true : false}
        onOpenChange={() => onClose("create-board-member")}>
        <DialogContent className="max-h-[85vh] overflow-auto w-full scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Add a new Board Member</DialogTitle>
            <DialogDescription>
              Kindly fill the form to add a new board member to the system.
              Remember that fields marked with (*) are required.
            </DialogDescription>
          </DialogHeader>

          <CreateBoardMemberForm
            onSubmit={handleBoardMemberCreation}
            isCreating={isCreating}
          />

          <DialogFooter>
            <DialogClose
              className={buttonVariants({
                variant: "secondary",
                className: "w-full",
              })}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
