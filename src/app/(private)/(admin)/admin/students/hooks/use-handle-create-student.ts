import { useTransition } from "react";
import { useStudentStore } from "../store";
import { createStudent } from "../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useHandleCreateStudent = () => {
  const { actions } = useStudentStore();
  const [isPending, startTranstion] = useTransition();
  const router = useRouter();

  const student = actions.getStudentData();

  const handleSubmission = () => {
    startTranstion(async () => {
      const { error } = await createStudent(student);
      if (error) {
        toast.error(
          error.toString() ||
            "An error occurred while trying to create the student!"
        );
      } else {
        toast.success("Student has been successfully created");
        actions.resetForm();
        return router.push("/admin/students");
      }
    });
  };

  return { isPending, handleSubmission };
};
