/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { CreateAttendanceForm } from "@/app/(private)/attendance/forms/create-attendance-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { BulkAttendanceType } from "@/lib/validation";
import { useRecordAttendanceMutationFn } from "../actions/mutations";

export const CreateAttendanceDialog = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useRecordAttendanceMutationFn();

  const handleAttendanceTracking = async (data: BulkAttendanceType) => {
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-attendance");
    });
  };

  const isOpen = !!dialogs["create-attendance"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-attendance")}>
      <DialogContent className="w-full md:max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Track Attendance</DialogTitle>
          <DialogDescription>
            Record attendace for a selected class, date and semester.
          </DialogDescription>
        </DialogHeader>

        <CreateAttendanceForm
          onSubmit={handleAttendanceTracking}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
