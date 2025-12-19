import { useStaffStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteStaffRequest, getStaffMember } from "../actions/server";
import { toast } from "sonner";

export const useDeleteStaff = () => {
  const [isPending, startTransition] = useTransition();
  const { deleteData, addData } = useStaffStore();

  const deleteStaff = async (id: string, employeedId: string) => {
    deleteData(employeedId);
    startTransition(async () => {
      const promiseResult = await deleteStaffRequest(id);
      if (!promiseResult.error && promiseResult.success !== undefined) {
        toast.success("staff has been deleted successfully!");
      } else {
        const rollbackPromise = await getStaffMember(id);
        if (!rollbackPromise.error && rollbackPromise.staff !== undefined) {
          addData(rollbackPromise.staff);
        }

        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete the staff"
        );
      }
    });
  };

  return { deleteStaff, isPending };
};
