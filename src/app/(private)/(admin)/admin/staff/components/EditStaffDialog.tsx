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
import CreateStaffForm from "./forms/create-staff-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHandleStaffUpdate } from "../hooks/use-handle-staff-update";
import { useHandleStaffDelete } from "../hooks/use-handle-staff.delete";
import { useFetchInitialStaffData } from "../hooks/use-fetch-initial-staff-data";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export default function EditStaffDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { handleStaffUpdate, isUpdating, updateError, updateSucess } =
    useHandleStaffUpdate();
  const { handleStaffDelete, isDeleting, success, error } =
    useHandleStaffDelete();
  const { values, fetchError } = useFetchInitialStaffData();

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

  // Close dialog on successful update
  useEffect(() => {
    if (updateSucess) {
      toast.success("Staff profile updated successfully");
      setTimeout(() => {
        onClose("editStaff");
      }, 100);
    }
  }, [updateSucess, onClose]);

  // Close dialog on successful delete
  useEffect(() => {
    if (success) {
      toast.success("Staff profile deleted successfully");
      setTimeout(() => {
        onClose("editStaff");
      }, 100);
    }
  }, [success, onClose]);

  return (
    <Dialog
      open={dialogs["editStaff"] === true ? true : false}
      onOpenChange={() => {
        onClose("editStaff");
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Profile</DialogTitle>
          <DialogDescription>
            Update staff information and assignments
          </DialogDescription>
        </DialogHeader>
        {values ? (
          <CreateStaffForm
            id={id as string}
            defaultValues={values}
            onSubmit={handleStaffUpdate}
            onDelete={handleStaffDelete}
            isPending={isUpdating}
            isDeletePending={isDeleting}
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading staff data...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
