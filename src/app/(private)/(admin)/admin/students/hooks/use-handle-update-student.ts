import { useTransition } from "react";
import { useStudentStore } from "../store";
import { updateStudent } from "../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useHandleStudentUpdate = () => {
  const { actions } = useStudentStore();
  const router = useRouter();

  const [isPending, startTranstion] = useTransition();
  const { id, ...rest } = actions.getStudentData();

  const handleUpdate = () => {
    startTranstion(async () => {
      const promiseResult = await updateStudent({ id, data: rest });

      if (!promiseResult.error && promiseResult.success) {
        toast.success("Student has been updated successfully!");
        actions.resetForm();
        return router.push("/admin/students");
      } else {
        toast.error(
          promiseResult.error?.toString() ||
            "An error has occurred while trying to update the student!"
        );
      }
    });
  };

  return { isPending, handleUpdate };
};
