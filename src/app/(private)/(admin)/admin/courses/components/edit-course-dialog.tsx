"use client";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { CourseResponseType } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { deleteCourse, getCourse, updateCourse } from "../actions/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import CreateCourseForm from "../forms/create-course";
import { CoursesType } from "@/lib/validation";

type CourseDetailType = Omit<
  CourseResponseType,
  "departments" | "classes" | "teachers"
>;

// interface FinalCourseDetail extends CourseDetailType {
//   departments: string[];
//   classes: string[];
//   staff: string[];
// }

const EditCourseDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const [course, setCourse] =
    useState<Awaited<ReturnType<typeof getCourse>>["course"]>();
  const [isDeletePending, startTransition] = useTransition();

  useEffect(() => {
    if (!id || !dialogs["editCourse"]) return;
    const fetchCourse = async () => {
      setCourse(undefined);
      const res = await getCourse(id as string);
      if (res.error || res.course === undefined) {
        return toast.error("Failed to fetch course");
      }

      setCourse({
        ...res.course,
      });
    };

    fetchCourse();
  }, [id, dialogs]);

  const handleUpdate = async (values: CoursesType) => {
    const { error } = await updateCourse({ id: id as string, data: values });
    if (error) {
      toast.error(error || "Something went wrong!");
      return;
    } else {
      toast.success("Course was updated successfully");
      setTimeout(() => onClose("editCourse"), 300);
    }
  };

  const handleDelete = async () => {
    startTransition(async () => {
      const { error } = await deleteCourse(id as string);

      if (error) {
        toast.error(error);
        return;
      } else {
        toast.success("Course deleted successfully!");
        setTimeout(() => onClose("editCourse"), 300);
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["editCourse"]}
        onOpenChange={() => onClose("editCourse")}>
        {course ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Kindly make changes and save in realtime!
              </DialogDescription>
            </DialogHeader>
            <CreateCourseForm
              defaultValues={{
                ...course,
                departments: course.departments.map((dt) => dt.id),
                classes: course.classes.map((cl) => cl.id),
                staff: course.staff.map((s) => s.id),
              }}
              id={id}
              onSubmit={handleUpdate}
              onDelete={handleDelete}
              isDeletePending={isDeletePending}
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
            <div className="w-full h-full flex justify-center items-center">
              <Loader2 className="animate-spin size-6" />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default EditCourseDialog;
