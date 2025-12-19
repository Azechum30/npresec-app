import { useClassesStore } from "@/hooks/use-generic-store";
import { bulkDeleteClasses, getClassesAction } from "../actions/server-actions";
import { toast } from "sonner";

export const useBulkDeleteClasses = () => {
  const { bulkAddData, bulkDeleteData } = useClassesStore();

  const deleteclasses = async (ids: string[], codes: string[]) => {
    bulkDeleteData(codes);
    const promiseResult = await bulkDeleteClasses({ ids });
    if (!promiseResult.error && promiseResult.count) {
      toast.success(
        `${promiseResult.count} ${
          promiseResult.count === 1 ? "class was" : "classes were"
        } deleted successfully`
      );
    } else {
      const rollbackPromise = await getClassesAction(ids);
      if (!rollbackPromise.error && rollbackPromise.data) {
        bulkAddData(rollbackPromise.data);
      }

      toast.error(
        promiseResult.error?.toString() ||
          "An error occurred while trying to delete the classes"
      );
    }
  };

  return { deleteclasses };
};
