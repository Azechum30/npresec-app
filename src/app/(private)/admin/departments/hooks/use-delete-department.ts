import { useDepartmentStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteDepartment } from "../actions/delete-departments-action";
import { toast } from "sonner";
import { getDepartment } from "../actions/get-department";

export const useDeleteDepartment = () => {
  const [isPending, startTransition] = useTransition();
  const { deleteData, addData } = useDepartmentStore();

  const deletedepartment = async (id: string, code: string) => {
    deleteData(code);
    startTransition(async () => {
      const promiseResult = await deleteDepartment(id);
      if (!("error" in promiseResult) && promiseResult) {
        toast.success("department was successfully deleted!");
      } else {
        const rollbackPromise = await getDepartment(id);
        if (!rollbackPromise.error && rollbackPromise.department) {
          addData(rollbackPromise.department);
        }

        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete the department!"
        );
      }
    });
  };

  return { deletedepartment, isPending };
};
