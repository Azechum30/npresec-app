import { useTeacherStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteTeacherRequest, getTeacher } from "../actions/server";
import { toast } from "sonner";

export const useDeleteTeacher = () => {
  const [isPending, startTransition] = useTransition();
  const { deleteData, addData } = useTeacherStore();

  const deleteTeacher = async (id: string, employeedId: string) => {
    deleteData(employeedId);
    startTransition(async () => {
      const promiseResult = await deleteTeacherRequest(id);
      if (!promiseResult.error && promiseResult.success !== undefined) {
        toast.success("teacher has been deleted successfully!");
      } else {
        const rollbackPromise = await getTeacher(id);
        if (!rollbackPromise.error && rollbackPromise.teacher !== undefined) {
          addData(rollbackPromise.teacher);
        }

        toast.error(
          promiseResult.error ||
            "An error occurred while trying to delete the teacher"
        );
      }
    });
  };

  return { deleteTeacher, isPending };
};
