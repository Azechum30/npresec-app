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
import { useGenericDialog } from "../../../../../hooks/use-open-create-teacher-dialog";
import CreateTeacherForm from "./forms/create-teacher-form";
import { TeacherType } from "@/lib/validation";
import { createTeacher } from "../actions/server";
import { useTeacherStore } from "@/hooks/use-generic-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function CreateTeacherDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { addData, deleteData, updateData } = useTeacherStore();
  const handleSubmit = async (data: TeacherType) => {
    addData(data as any);
    const res = await createTeacher(data);
    if (res?.teacher) {
      onClose("createTeacher");
      toast.success("Teacher added successfully!");
      updateData(res?.teacher.employeeId as string, res.teacher);
    } else if (res?.errors) {
      console.log(res.errors);
      toast.error(res.errors.join("\n"));
      deleteData(data.employeeId);
    } else {
      toast.error(res.error);
      deleteData(data.employeeId);
    }
    return res;
  };
  return (
    <Dialog
      open={dialogs["createTeacher"]}
      onOpenChange={() => onClose("createTeacher")}>
      <DialogContent className="w-full md:max-w-2xl h-full">
        <DialogHeader>
          <DialogTitle>Create New Teacher Profile</DialogTitle>
          <DialogDescription>
            Fill the form to add a new teacher. All fields with the asterisk (*)
            are required and must be filled before submitting the form.
          </DialogDescription>
        </DialogHeader>
        <CreateTeacherForm onSubmit={handleSubmit} />
        <DialogFooter>
          <DialogClose
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
