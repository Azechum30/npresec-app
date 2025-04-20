import { useClassesStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteClass, getClass } from "../actions/server-actions";
import { toast } from "sonner";

export const useDeleteClass = () => {
  const [isPending, startTransition] = useTransition();
  const { deleteData, addData } = useClassesStore();

  const deleteclass = async (id: string, code: string) => {
    deleteData(code);

    startTransition(async () => {
      const promiseResult = await deleteClass({ id });
      if (!promiseResult.error && promiseResult.class) {
        toast.success("Class has been deleted successfully!");
      } else {
        const rollbackPromise = await getClass(id);
        if (!("error" in rollbackPromise) && rollbackPromise) {
          addData(rollbackPromise);
        }

        toast.error(
          promiseResult.error.toString() ||
            "An error occurred while trying to delete the class"
        );
      }
    });
  };

  return { isPending, deleteclass };
};
