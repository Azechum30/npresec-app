/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { MarkSingleStudentAttendanceForm } from "@/app/(private)/attendance/forms/mark-single-student-attendance-form";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { Semester, SingleStudentAttendance } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateAttendanceMutationFn } from "../actions/mutations";
import { getAttendanceQueryOptions } from "../actions/queries";

export const EditAttendanceDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateAttendanceMutationFn(
    id as string,
  );

  const isOpen = !!dialogs["edit-attendance"];
  const validId = id ?? null;

  const { data } = useQuery({
    ...getAttendanceQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleSingleAttendUpdate = async (data: SingleStudentAttendance) => {
    await Promise.try(async () => {
      await mutateAsync({ data, id: validId as string });
      onClose("edit-attendance");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-attendance")}>
      <DialogContent>
        {data && isOpen && validId ? (
          <>
            <DialogHeader>
              <DialogTitle>Update Student Attendance</DialogTitle>
              <DialogDescription>
                Make changes to the selected student&apos;s attendance and save
                in real-time.
              </DialogDescription>
            </DialogHeader>
            <MarkSingleStudentAttendanceForm
              onSubmitAction={handleSingleAttendUpdate}
              defaultValues={{
                classId: data.classId,
                date: data.date,
                semester: data.semester as (typeof Semester)[number],
                status: data.status,
                studentId: data.student.id,
              }}
              id={id}
              isPending={isPending}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading</DialogTitle>
              <DialogDescription>Data is loading...</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
