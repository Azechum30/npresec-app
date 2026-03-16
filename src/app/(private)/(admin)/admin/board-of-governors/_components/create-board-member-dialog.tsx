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
import { CreateBoardMemberForm } from "../_forms/create-boader-member";
import { useHandleBoardMemberCreation } from "../_hooks/use-handle-board-member-creation";

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
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
