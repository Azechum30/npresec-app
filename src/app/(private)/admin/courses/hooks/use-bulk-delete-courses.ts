import { useCourseStore } from "@/hooks/use-generic-store";
import { bulkDeleteCourses, getCourses } from "../actions/actions";
import { toast } from "sonner";

export const useBulkDeleteCourses = () => {
  const { bulkAddData, bulkDeleteData } = useCourseStore();

  const deleteCourses = async (ids: string[], codes: string[]) => {
    bulkDeleteData(codes);
    const promiseResult = await bulkDeleteCourses(ids);
    if (!promiseResult.error && promiseResult.count) {
      toast.success(
        `${promiseResult.count} ${
          promiseResult.count === 1 ? "course" : "courses"
        } ${promiseResult.count === 1 ? "has" : "have"} deleted`
      );
    } else {
      const rollbackPromise = await getCourses(ids);
      if (!rollbackPromise.error && rollbackPromise.courses) {
        bulkAddData(rollbackPromise.courses);
      }
      toast.error(
        promiseResult.error ||
          "An error occurred while trying to delete the courses"
      );
    }
  };

  return { deleteCourses };
};
