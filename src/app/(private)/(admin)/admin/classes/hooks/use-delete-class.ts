import { useClassesStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteClass, getClass } from "../actions/server-actions";
import { toast } from "sonner";

export const useDeleteClass = () => {
  const [isPending, startTransition] = useTransition();
  const deleteclass = async (id: string, code: string) => {
    startTransition(async () => {
      const { error } = await deleteClass({ id });
      if (error) {
        toast.error(
          error || "An error occurred while trying to delete the class"
        );
        toast.success("Class has been deleted successfully!");
      } else {
        toast.success("Class has been deleted successfully!");
      }
    });
  };

  return { isPending, deleteclass };
};
