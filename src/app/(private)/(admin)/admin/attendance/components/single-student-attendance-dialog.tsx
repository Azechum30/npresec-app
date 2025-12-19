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
import { MarkSingleStudentAttendanceForm } from "@/app/(private)/(admin)/admin/attendance/forms/mark-single-student-attendance-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useHandleSingleAttendanceCreation } from "@/app/(private)/(admin)/admin/attendance/hooks/use-handle-single-attendance-creation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const SingleStudentAttendanceDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { isPending, handleSingleAttendanceCreation } =
    useHandleSingleAttendanceCreation();
  return (
    <>
      <Dialog
        open={dialogs["createSingleAttendance"]}
        onOpenChange={() => onClose("createSingleAttendance")}>
        <DialogContent className="w-full h-full md:max-h-[85vh] overflow-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Record Student Attendance</DialogTitle>
            <DialogDescription>
              Kindly record the student attendance by filling the form and
              saving!
            </DialogDescription>
          </DialogHeader>
          <MarkSingleStudentAttendanceForm
            onSubmitAction={handleSingleAttendanceCreation}
            isPending={isPending}
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
        </DialogContent>
      </Dialog>
    </>
  );
};
