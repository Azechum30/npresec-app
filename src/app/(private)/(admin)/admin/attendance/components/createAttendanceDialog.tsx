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
import { CreateAttendanceForm } from "@/app/(private)/(admin)/admin/attendance/forms/create-attendance-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHandleAttendanceCreations } from "@/app/(private)/(admin)/admin/attendance/hooks/use-handle-attendance-creations";

export const CreateAttendanceDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { isPending, handleAttendanceCreations } =
    useHandleAttendanceCreations();
  return (
    <Dialog
      open={dialogs["createAttendance"]}
      onOpenChange={() => onClose("createAttendance")}>
      <DialogContent className="w-full md:max-w-[85vw] lg:max-w-[60vw] md:max-h-[85vh] overflow-auto scrollbar-thin ">
        <DialogHeader>
          <DialogTitle>Record a new Attendance</DialogTitle>
          <DialogDescription>
            Kindly track attendance for the selected class for the selected
            class and date
          </DialogDescription>
        </DialogHeader>

        <CreateAttendanceForm
          onSubmit={handleAttendanceCreations}
          isPending={isPending}
        />
        <DialogFooter>
          <DialogClose
            className={cn("w-full", buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
