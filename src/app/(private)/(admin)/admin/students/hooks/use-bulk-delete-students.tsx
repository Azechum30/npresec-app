import { useStudentDataStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { bulkDeleteStudents, getStudents } from "../actions/action";
import { toast } from "sonner";
import LoadingComponent from "@/components/customComponents/LoadingComponent";

export const useBulkDeleteStudents = () => {
  const [isPending, startTransition] = useTransition();
  const { bulkAddData, bulkDeleteData } = useStudentDataStore();
  const deleteStudents = async (ids: string[], studentIds?: string[]) => {
    if (studentIds) {
      bulkDeleteData(studentIds);
    }

    startTransition(async () => {
      try {
        const promiseResult = await bulkDeleteStudents(ids);
        if (!promiseResult.error && promiseResult.count !== undefined) {
          toast.success(
            `${promiseResult.count} students were deleted successfully!`
          );
        } else {
          const rollbackPromise = await getStudents(ids);
          if (
            !rollbackPromise.error &&
            rollbackPromise.students !== undefined
          ) {
            bulkAddData(rollbackPromise.students);
          }
          toast.error(promiseResult.error || "Bulk deletion failed");
        }
      } catch (error) {
        toast.error("An unexpected error occurred during bulk deletion.");
      }
    });
  };

  return {
    deleteStudents,
    isPending,
  };
};
