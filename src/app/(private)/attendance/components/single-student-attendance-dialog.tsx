/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { MarkSingleStudentAttendanceForm } from "@/app/(private)/attendance/forms/mark-single-student-attendance-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { SingleStudentAttendance } from "@/lib/validation";
import { useRecordSingleAttendanceMutationFn } from "../actions/mutations";

export const SingleStudentAttendanceDialog = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useRecordSingleAttendanceMutationFn();

  const isOpen = !!dialogs["create-single-attendance"];

  const handleSingleAttendanceCreation = async (
    data: SingleStudentAttendance,
  ) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-single-attendance");
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("create-single-attendance")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Student Attendance</DialogTitle>
          <DialogDescription>
            Kindly record a student attendance by filling the form and saving
          </DialogDescription>
        </DialogHeader>
        <MarkSingleStudentAttendanceForm
          onSubmitAction={handleSingleAttendanceCreation}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
