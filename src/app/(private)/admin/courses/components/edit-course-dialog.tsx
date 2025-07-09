"use client";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CourseResponseType } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { deleteCourse, getCourse, updateCourse } from "../actions/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import CreateCourseForm from "../forms/create-course";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCourseStore } from "@/hooks/use-generic-store";
import { CoursesType } from "@/lib/validation";

type CourseDetailType = Omit<
  CourseResponseType,
  "departments" | "classes" | "teachers"
>;

interface FinalCourseDetail extends CourseDetailType {
  departments: string[];
  classes: string[];
  teachers: string[];
}

const EditCourseDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const [course, setCourse] = useState<FinalCourseDetail>();
  const { updateData, deleteData, addData } = useCourseStore();
  const [isDeletePending, startTransition] = useTransition();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getCourse(id as string);
      if (res.error || res.course === undefined) {
        return toast.error("Failed to fetch course");
      }

      setCourse({
        ...res.course,
        departments: res.course.departments.map((d) => d.id),
        classes: res.course.classes.map((c) => c.id),
        teachers: res.course.teachers.map((t) => t.id),
      });
    };

    if (id) {
      setCourse(undefined);
      fetchCourse().then((value)=>console.log(value));
    }
  }, [id]);

  const handleUpdate = async (values: CoursesType) => {
    updateData(values.code, values as any);
    const res = await updateCourse({ id: id as string, data: values });
    if (res.error || res.course === undefined) {
      const rollbackData = await getCourse(id as string);
      if (!(rollbackData.error || rollbackData.course === undefined)) {
        updateData(rollbackData.course.code, rollbackData.course);
      }
      toast.error(res.error || "Something went wrong!");

      return;
    } else {
      onClose("editCourse");
      updateData(res.course.code, res.course);
      toast.success("Course was updated successfully");
      return res.course;
    }
  };

  const handleDelete = async () => {
    deleteData(course?.code as string);
    startTransition(async () => {
      const res = await deleteCourse(id as string);

      if (res.error || res.course === undefined) {
        const rollbackData = await getCourse(id as string);
        if (!(rollbackData.error || rollbackData.course === undefined)) {
          addData(rollbackData.course);
        }

        toast.error(res.error);
        return;
      } else {
        onClose("editCourse");
        toast.success("Course deleted successfully!");
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["editCourse"]}
        onOpenChange={() => onClose("editCourse")}>
        {course ? (
          <DialogContent className="w-full max-h-[85vh] overflow-auto scrollbar-thin">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Make changes to the course and save in real-time. Kindly note
                that fields marked with asterisks (*) are mandatory and cannot
                be left empty!
              </DialogDescription>
            </DialogHeader>
            <CreateCourseForm
              defaultValues={course}
              id={id}
              onSubmit={handleUpdate}
              onDelete={handleDelete}
              isDeletePending={isDeletePending}
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
