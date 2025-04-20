import { useTeacherStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { bulkDeleteTeachers, getTeachers } from "../actions/server";
import { toast } from "sonner";

export const useBulkDeleteTeachers = () => {
  const [isPending, startTransition] = useTransition();
  const { bulkAddData, bulkDeleteData } = useTeacherStore();

  const deleteteachers = async (ids: string[], employeeIds: string[]) => {
    bulkDeleteData(employeeIds);

    startTransition(async () => {
      const promiseResult = await bulkDeleteTeachers(ids);
      if (!promiseResult.error && promiseResult.count !== undefined) {
        toast.success(
          `${promiseResult.count} teacher${promiseResult.count > 0 && "s"} ${
            promiseResult.count > 0 ? "were" : "was"
          } deleted successfully!`
        );
      } else {
        const rollbackPromise = await getTeachers(ids);
        if (!rollbackPromise.error && rollbackPromise.teachers !== undefined) {
          bulkAddData(rollbackPromise.teachers);
        }
        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete teachers"
        );
      }
    });
  };

  return { deleteteachers, isPending };
};
