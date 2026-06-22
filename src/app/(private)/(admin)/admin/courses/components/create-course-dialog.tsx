/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { CoursesType } from "@/lib/validation";
import { useCreateCourseMutationFn } from "../actions/mutations";
import CreateCourseForm from "../forms/create-course";

export default function CreateCourseDialog() {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useCreateCourseMutationFn();

  const handleSubmit = (values: CoursesType) =>
    Promise.try(async () => {
      await mutateAsync(values);
      onClose("create-course");
    });

  const isOpen = !!dialogs["create-course"];
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-course")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Course</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new course!
          </DialogDescription>
        </DialogHeader>
        <CreateCourseForm onSubmitAction={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
