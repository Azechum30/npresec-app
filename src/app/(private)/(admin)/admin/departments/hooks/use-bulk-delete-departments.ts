/** biome-ignore-all assist/source/organizeImports: reason */

import { useDepartmentStore } from "@/hooks/use-generic-store";
import { toast } from "sonner";
import { deleteDepartments } from "../actions/delete-departments-action";
import { getServerSideProps } from "../actions/getServerSideProps";

export const useBulkDeleteDepartments = () => {
  const { bulkAddData, bulkDeleteData } = useDepartmentStore();
  const deletedepartments = async (ids: string[], codes: string[]) => {
    bulkDeleteData(codes);
    const promiseResult = await deleteDepartments({ ids });
    if (!promiseResult.error && promiseResult.count) {
      toast.success(
        `${promiseResult.count} ${
          promiseResult.count === 1 ? "teacher was" : "teachers were"
        } successfully deleted!`,
      );
    } else {
      const rollbackPromise = await getServerSideProps(ids);
      if (rollbackPromise.departments) {
        bulkAddData(rollbackPromise.departments);
      }

      toast.error(
        promiseResult.error ||
          "An error occurred while trying to delete the departments!",
      );
    }
  };
  return { deletedepartments };
};
