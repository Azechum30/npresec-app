/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { StaffType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateStaffMutationFn } from "../actions/mutations";
import { getStaffQueryOptions } from "../actions/queries";
import CreateStaffForm from "./forms/create-staff-form";

export default function EditStaffDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateStaffMutationFn(id as string);

  const isOpen = !!dialogs["edit-staff"];
  const validId = id ?? null;

  const { data } = useQuery({
    ...getStaffQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleStaffUpdate = (data: StaffType) =>
    Promise.try(async () => {
      await mutateAsync({ ...data, id: validId as string });
      onClose("edit-staff");
    });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-staff")}>
      {validId && isOpen && data ? (
        <DialogContent className="w-full md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Profile</DialogTitle>
            <DialogDescription>
              Update staff information and assignments
            </DialogDescription>
          </DialogHeader>

          <CreateStaffForm
            id={id}
            defaultValues={{
              ...data,
              courses: data.courses.map((c) => c.id),
              email: data.user?.email as string,
              username: data.user?.username as string,
              classes: data.classes.map((c) => c.id),
              licencedNumber: data.licencedNumber ?? undefined,
              rgNumber: data.rgNumber ?? undefined,
              ghcardNumber: data.ghcardNumber ?? undefined,
              ssnitNumber: data.ssnitNumber ?? undefined,
              imageURL: data.user?.image ?? undefined,
              academicQual: data.academicQual ?? undefined,
            }}
            onSubmitAction={handleStaffUpdate}
            isPending={isPending}
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
