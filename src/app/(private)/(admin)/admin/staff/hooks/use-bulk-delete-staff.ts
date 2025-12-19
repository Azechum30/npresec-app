import { useStaffStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { bulkDeleteStaff, getStaff } from "../actions/server";
import { toast } from "sonner";

export const useBulkDeleteStaff = () => {
  const [isBulkDeletePending, startTransition] = useTransition();
  const { bulkAddData, bulkDeleteData } = useStaffStore();

  const deletestaff = async (ids: string[], employeeIds: string[]) => {
    bulkDeleteData(employeeIds);

    startTransition(async () => {
      const promiseResult = await bulkDeleteStaff(ids);
      if (!promiseResult.error && promiseResult.count !== undefined) {
        toast.success(
          `${promiseResult.count} staff${promiseResult.count > 0 && "s"} ${
            promiseResult.count > 0 ? "were" : "was"
          } deleted successfully!`
        );
      } else {
        const rollbackPromise = await getStaff(ids);
        if (!rollbackPromise.error && rollbackPromise.staff !== undefined) {
          bulkAddData(rollbackPromise.staff);
        }
        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete staff"
        );
      }
    });
  };

  return { deletestaff, isBulkDeletePending };
};
