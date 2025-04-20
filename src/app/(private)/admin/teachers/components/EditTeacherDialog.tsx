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
import { useGenericDialog } from "../../../../../hooks/use-open-create-teacher-dialog";
import { useEffect, useState, useTransition } from "react";
import {
  deleteTeacherRequest,
  getTeacher,
  updateTeacher,
} from "../actions/server";
import { toast } from "sonner";
import { TeacherType } from "@/lib/validation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeacherStore } from "@/hooks/use-generic-store";
import { buttonVariants } from "@/components/ui/button";

export default function EditTeacherDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { updateData, deleteData, addData } = useTeacherStore();

  const [defaultValues, setDefaultValues] = useState<TeacherType | undefined>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchTeacher = async () => {
      const res = await getTeacher(id as string);

      if (res.error) {
        return toast.error(res.error);
      }
      if (res.teacher === undefined) {
        return toast.success("Loading data...");
      }
      setDefaultValues({
        ...res.teacher,
        email: res.teacher.user?.email as string,
        username: res.teacher.user?.username as string,
        ssnitNumber: res.teacher.ssnitNumber || "",
        licencedNumber: res.teacher.licencedNumber || "",
        rank: res.teacher.rank || "",
        classes: res.teacher.classes.map((classItem) => classItem.id),
        courses: res.teacher.courses.map((course) => course.id),
        departmentId: res.teacher.departmentId,
        dateOfFirstAppointment:
          (res.teacher.dateOfFirstAppointment as Date) || undefined,
      });
    };

    if (id) {
      setDefaultValues(undefined);
      fetchTeacher();
    }
  }, [id]);

  const handleUpdate = async (data: TeacherType) => {
    updateData(data.employeeId, data as any);
    const res = await updateTeacher(String(id), data);

    if (res?.error) {
      toast.error(res.error);
      updateData(defaultValues?.employeeId as string, defaultValues as any);
    } else {
      toast.success("Teacher record updated successfully!");
      onClose("editTeacher");
      updateData(res?.data?.employeeId as any, res?.data as any);
    }

    return res;
  };

  const handleDelete = async () => {
    deleteData(defaultValues?.employeeId as string);
    startTransition(async () => {
      const res = await deleteTeacherRequest(id as string);
      if ("error" in res) {
        const rollbackData = await getTeacher(id as string);
        if (!(rollbackData.error || rollbackData.teacher === undefined)) {
          addData(rollbackData.teacher);
        }
        toast.error(res.error);
        return;
      } else {
        onClose("editTeacher");
        toast.success("The selected teacher was deleted successfully");
      }
    });
  };

  return (
    <Dialog
      open={dialogs["editTeacher"]}
      onOpenChange={() => onClose("editTeacher")}>
      <DialogContent
        className={cn(defaultValues !== undefined && "h-full max-w-2xl")}>
        {defaultValues ? (
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
              defaultValues={defaultValues}
              onSubmit={handleUpdate}
              onDelete={handleDelete}
              isDeletePending={isPending}
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
