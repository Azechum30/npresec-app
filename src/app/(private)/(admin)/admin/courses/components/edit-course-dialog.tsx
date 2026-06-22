/**biome-ignore-all assist/source/organizeImports: reason */

"use client";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { CoursesType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateCourseMutationFn } from "../actions/mutations";
import { getCourseQueryOption } from "../actions/queries";
import CreateCourseForm from "../forms/create-course";

const EditCourseDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { isPending, mutateAsync } = useUpdateCourseMutationFn(id as string);

  const validId = id ?? null;
  const isOpen = !!dialogs["edit-course"];

  const { data } = useQuery({
    ...getCourseQueryOption(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleUpdate = async (values: CoursesType) =>
    Promise.try(async () => {
      await mutateAsync({ data: { ...values }, id: validId as string });
      onClose("edit-course");
    });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-course")}>
      {data && isOpen && validId ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Kindly make changes and save in realtime!
            </DialogDescription>
          </DialogHeader>
          <CreateCourseForm
            defaultValues={{
              title: data.title,
              code: data.code,
              classes: data.classes.map((cls) => cls.id),
              createdAt: data.createdAt,
              credits: data.credits,
              departments: data.departments.map((dp) => dp.id),
              description: data.description,
              staff: data.staff.map((st) => st.id),
            }}
            id={validId}
            onSubmitAction={handleUpdate}
            isPending={isPending}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading Data</DialogTitle>
            <DialogDescription>
              Please waiting data being fetched!
            </DialogDescription>
          </DialogHeader>
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default EditCourseDialog;
