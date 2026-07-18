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
import type { StudentHouseAllocationType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateAllocationMutation } from "../_actions/mutations";
import { getAllocationQueryOptions } from "../_actions/queries";
import { StudentHouseAllocationForm } from "../_forms/student-house-allocation-form";

export const EditStudentAllocationModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateAllocationMutation();

  const validId = id ?? null;
  const isOpen = !!dialogs["edit-allocation"];

  const { data } = useQuery({
    ...getAllocationQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleAllocationUpdate = async (values: StudentHouseAllocationType) => {
    await Promise.try(async () => {
      await mutateAsync({ ...values, id: validId as string });
      onClose("edit-allocation");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-allocation")}>
      <DialogContent>
        {data && isOpen && validId ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit House Allocation</DialogTitle>
              <DialogDescription>
                Make changes to student&apos;s and save in realtime
              </DialogDescription>
            </DialogHeader>
            <StudentHouseAllocationForm
              onSubmitAction={handleAllocationUpdate}
              isPending={isPending}
              id={validId}
              defaultValues={{
                houseId: data.house.id,
                roomId: data.student.roomId as string,
                studentNumber: data.student.id,
                status: data.status,
              }}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Data Loads</DialogTitle>
              <DialogDescription>Wait while the data loads</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
