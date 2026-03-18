"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import CreateStaffForm from "./forms/create-staff-form";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useFetchInitialStaffData } from "../hooks/use-fetch-initial-staff-data";
import { useHandleStaffUpdate } from "../hooks/use-handle-staff-update";
import { useHandleStaffDelete } from "../hooks/use-handle-staff.delete";

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

  useEffect(() => {
    if (updateSucess) {
      toast.success("Staff profile updated successfully");
      setTimeout(() => {
        onClose("editStaff");
      }, 100);
    }
  }, [updateSucess, onClose]);

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
      {!!id && dialogs["editStaff"] && values ? (
        <DialogContent className="w-full md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Profile</DialogTitle>
            <DialogDescription>
              Update staff information and assignments
            </DialogDescription>
          </DialogHeader>

          <CreateStaffForm
            id={id}
            defaultValues={values}
            onSubmit={handleStaffUpdate}
            onDelete={handleStaffDelete}
            isPending={isUpdating}
            isDeletePending={isDeleting}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Data is Loading</DialogTitle>
            <DialogDescription>Kindly wait while data loads.</DialogDescription>
          </DialogHeader>
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
}
