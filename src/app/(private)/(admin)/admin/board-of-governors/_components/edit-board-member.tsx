"use client";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrefetchBoardMember } from "../_hooks/use-prefetch-board-member";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { CreateBoardMemberForm } from "../_forms/create-boader-member";
import LoadingState from "@/components/customComponents/Loading";
import { buttonVariants } from "@/components/ui/button";
import { useHandleDeleteBoardMember } from "../_hooks/use-handle-delete-board-member";
import { useHandleUpdateBoardMember } from "../_hooks/use-handle-update-board-member";

export const EditBoardMember = () => {
  const { values, fetchError, isFetching } = usePrefetchBoardMember();
  const { error, handleDeleteBoardMember, isDeleting, success } =
    useHandleDeleteBoardMember();
  const { id, dialogs, onClose } = useGenericDialog();
  const { handleUpdateBoardMember, isUpdating, updateError, updateSuccess } =
    useHandleUpdateBoardMember();

  const prevFetchErrorRef = useRef(false);
  const prevDeleteErrorRef = useRef(false);
  const prevSuccessRef = useRef(false);
  const prevUpdatingRef = useRef(false);
  const prevUpdateSuccessRef = useRef(false);

  useEffect(() => {
    const wasError = prevFetchErrorRef.current;

    if (wasError && !isFetching && fetchError) {
      toast.error(fetchError);
    }
    prevFetchErrorRef.current = isFetching;
  }, [fetchError, isFetching]);

  useEffect(() => {
    const wasDeleteError = prevDeleteErrorRef.current;
    if (wasDeleteError && !isDeleting && error) {
      toast.error(error);
    }
    prevDeleteErrorRef.current = isDeleting;
  }, [error, isDeleting]);

  useEffect(() => {
    const wasSuccess = prevSuccessRef.current;

    if (wasSuccess && !isDeleting && success) {
      toast.success("Board member was deleted successfully");
      setTimeout(() => onClose("edit-board-of-governor"), 100);
    }
    prevSuccessRef.current = isDeleting;
  }, [success, isDeleting, onClose]);

  useEffect(() => {
    const wasUpdating = prevUpdatingRef.current;
    if (wasUpdating && !isUpdating && updateError) {
      toast.error(updateError);
    }
    prevUpdatingRef.current = isUpdating;
  }, [isUpdating, updateError]);

  useEffect(() => {
    const wasUpdateSuccess = prevUpdateSuccessRef.current;

    if (wasUpdateSuccess && !isUpdating && updateSuccess) {
      toast.success("Changes saved successfully!");
      setTimeout(() => onClose("edit-board-of-governor"), 100);
    }
    prevUpdateSuccessRef.current = isUpdating;
  }, [updateSuccess, isUpdating, onClose]);

  return (
    <>
      <Dialog
        open={dialogs["edit-board-of-governor"] === true ? true : false}
        onOpenChange={() => onClose("edit-board-of-governor")}>
        {values ? (
          <DialogContent className="max-h-[85vh] overflow-auto w-full scrollbar-thin">
            <DialogHeader>
              <DialogTitle>Edit Board Member Details</DialogTitle>
              <DialogDescription>
                Make changes and save in real-time
              </DialogDescription>
            </DialogHeader>
            <CreateBoardMemberForm
              onSubmit={handleUpdateBoardMember}
              defaultValues={values}
              id={id}
              onDelete={() => handleDeleteBoardMember(id as string)}
              isCreating={isUpdating}
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
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">Loading Member Data</DialogTitle>
              <DialogDescription className="sr-only">
                Kindly wait while we load the board&apos;s member details
              </DialogDescription>
            </DialogHeader>
            <LoadingState />
          </DialogContent>
        )}
      </Dialog>
      {isDeleting && <LoadingState />}
    </>
  );
};
