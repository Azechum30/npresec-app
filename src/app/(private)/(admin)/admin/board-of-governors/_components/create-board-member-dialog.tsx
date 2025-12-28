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
  }, [createError, isCreating]);

  useEffect(() => {
    if (createSuccess) {
      toast.success("Board member added successfully");
      setTimeout(() => {
        onClose("create-board-member");
      }, 300);
    }
  }, [createSuccess, onClose]);

  return (
    <>
      <Dialog
        open={dialogs["create-board-member"] === true ? true : false}
        onOpenChange={() => onClose("create-board-member")}>
        {dialogs["create-board-member"] && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new Board Member</DialogTitle>
              <DialogDescription>
                Kindly fill the form to create a new board memberS
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
        )}
      </Dialog>
    </>
  );
};
