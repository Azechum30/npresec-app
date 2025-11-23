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
import CreateTeacherForm from "./forms/create-teacher-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHandleTeacherUpdate } from "../hooks/use-handle-teacher-update";
import { useHandleTeacherDelete } from "../hooks/use-handle-teacher.delete";
import { useFetchInitialTeacherData } from "../hooks/use-fetch-initial-teacher-data";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export default function EditTeacherDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { handleTeacherUpdate, isUpdating, updateError, updateSucess } =
    useHandleTeacherUpdate();
  const { handleTeacherDelete, isDeleting, success, error } =
    useHandleTeacherDelete();
  const { values, fetchError } = useFetchInitialTeacherData();

  // Show initial fetch error once
  const didShowFetchErrorRef = useRef(false);
  useEffect(() => {
    if (fetchError && !didShowFetchErrorRef.current) {
      toast.error(fetchError);
      didShowFetchErrorRef.current = true;
    }
  }, [fetchError]);

  // Show update error after an attempt completes
  const prevUpdatingRef = useRef<boolean>(false);
  useEffect(() => {
    const wasUpdating = prevUpdatingRef.current;
    if (wasUpdating && !isUpdating && updateError) {
      toast.error(updateError);
    }
    prevUpdatingRef.current = isUpdating;
  }, [isUpdating, updateError]);

  // Show delete error after an attempt completes
  const prevDeletingRef = useRef<boolean>(false);
  useEffect(() => {
    const wasDeleting = prevDeletingRef.current;
    if (wasDeleting && !isDeleting && error) {
      toast.error(error);
    }
    prevDeletingRef.current = isDeleting;
  }, [isDeleting, error]);

  useEffect(() => {
    if (success) {
      toast.success("Teacher deleted successfully");
      setTimeout(() => {
        onClose("editTeacher");
      }, 100);
    }
    if (updateSucess) {
      toast.success("Changes saved successfully");
      setTimeout(() => {
        onClose("editTeacher");
      }, 100);
    }
  }, [success, updateSucess, onClose]);

  return (
    <Dialog
      open={dialogs["editTeacher"] === true ? true : false}
      onOpenChange={() => onClose("editTeacher")}>
      <DialogContent
        className={cn(
          values !== undefined &&
            "max-h-[85vh] overflow-auto max-w-2xl scrollbar-thin"
        )}>
        {values ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Teacher Profile</DialogTitle>
              <DialogDescription className="max-w-prose">
                Make changes to the selected teacher's profile data and save the
                changes in real-time. Be aware that the fields marked with
                asterisk (*) are all required and must not be left empty.
              </DialogDescription>
            </DialogHeader>
            <CreateTeacherForm
              id={id}
              defaultValues={values}
              onSubmit={handleTeacherUpdate}
              onDelete={handleTeacherDelete}
              isDeletePending={isDeleting}
              isPending={isUpdating}
            />
            <DialogFooter>
              <DialogClose
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full"
                )}>
                Cancel
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading Teacher Profile</DialogTitle>
              <DialogDescription>Loading</DialogDescription>
            </DialogHeader>
            <div className="w-full h-full flex justify-center items-center">
              <Loader2 className="size-8 animate-spin" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
