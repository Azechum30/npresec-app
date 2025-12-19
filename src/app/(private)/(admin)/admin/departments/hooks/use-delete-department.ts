import { useTransition } from "react";
import { deleteDepartment } from "../actions/delete-departments-action";
import { toast } from "sonner";

export const useDeleteDepartment = () => {
  const [isPending, startTransition] = useTransition();

  const deletedepartment = async (id: string) => {
    startTransition(async () => {
      const { error } = await deleteDepartment(id);
      if (error) {
        toast.error(error);
      } else {
        toast.success("department deleted successfully");
      }
    });
  };

  return { deletedepartment, isPending };
};
