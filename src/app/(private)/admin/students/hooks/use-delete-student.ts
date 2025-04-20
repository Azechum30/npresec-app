import { useStudentDataStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { deleteStudent, getStudent } from "../actions/action";
import { toast } from "sonner";

export const useDeleteStudent = () => {
  const { deleteData, addData } = useStudentDataStore();
  const [isPending, startTransition] = useTransition();

  const deletestudent = async (id: string, stID?: string) => {
    deleteData(stID as string);
    try {
      startTransition(async () => {
        const promiseResult = await deleteStudent(id);
        if (!promiseResult.error && promiseResult.success !== undefined) {
          toast.success("Student has been deleted successfully!");
        } else {
          const rollbackPromise = await getStudent(id);
          if (!rollbackPromise.error && rollbackPromise.student !== undefined) {
            addData(rollbackPromise.student);
          }

          toast.error(promiseResult.error || "Could delete student");
        }
      });
    } catch (error) {
      toast.error("Some error occurred while trying to delete the student");
    }
  };

  return { deletestudent, isPending };
};
