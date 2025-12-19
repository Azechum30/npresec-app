"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import CreateCourseForm from "../forms/create-course";
import { CoursesType } from "@/lib/validation";
import { createCourse } from "../actions/actions";
import { toast } from "sonner";

export default function CreateCourseDialog() {
  const { dialogs, onClose } = useGenericDialog();

  const handleSubmit = async (values: CoursesType) => {
    const { error } = await createCourse(values);
    if (error) {
      toast.error(error);
      return;
    } else {
      toast.success("Course created successfully");
      setTimeout(() => onClose("createCourse"), 300);
    }
  };
  return (
    <>
      <Dialog
        open={dialogs["createCourse"]}
        onOpenChange={() => onClose("createCourse")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Course</DialogTitle>
            <DialogDescription>
              Kindly fill the form to create a new course!
            </DialogDescription>
          </DialogHeader>
          <CreateCourseForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
}
