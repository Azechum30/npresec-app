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
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import CreateCourseForm from "../forms/create-course";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CoursesType } from "@/lib/validation";
import { createCourse } from "../actions/actions";
import { toast } from "sonner";
import { useCourseStore } from "@/hooks/use-generic-store";

export default function CreateCourseDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { addData, deleteData, updateData } = useCourseStore();

  const handleSubmit = async (values: CoursesType) => {
    addData(values as any);
    const resp = await createCourse(values);
    if (resp.error || resp.course === undefined) {
      deleteData(values.code);
      toast.error(resp.error);
      return;
    } else {
      onClose("createCourse");
      updateData(resp.course.code as string, resp.course);
      toast.success("Course created successfully");
      return resp.course;
    }
  };
  return (
    <>
      <Dialog
        open={dialogs["createCourse"]}
        onOpenChange={() => onClose("createCourse")}>
        <DialogContent className="w-full max-h-[85vh] overflow-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Create a New Course</DialogTitle>
            <DialogDescription>
              Fill the form below to create a new course. Kindly note that
              fields marked with asterisks (*) are mandatory and cannot be left
              empty!
            </DialogDescription>
          </DialogHeader>
          <CreateCourseForm onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose
              className={cn(
                "w-full",
                buttonVariants({ variant: "secondary" })
              )}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
