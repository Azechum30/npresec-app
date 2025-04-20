import { useCourseStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteCourse, getCourse } from "../actions/actions";
import { toast } from "sonner";

export const useDeleteCourse = () => {
  const [isPending, startTransition] = useTransition();
  const { deleteData, addData } = useCourseStore();

  const deletecourse = async (id: string, code: string) => {
    deleteData(code);
    startTransition(async () => {
      const promiseResult = await deleteCourse(id);
      if (!promiseResult.error && promiseResult.course !== undefined) {
        toast.success("Course has been deleted successfully!");
      } else {
        const rollbackPromise = await getCourse(id);
        if (!rollbackPromise.error && rollbackPromise.course) {
          addData(rollbackPromise.course);
        }

        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete the course"
        );
      }
    });
  };

  return { deletecourse, isPending };
};
