import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createStudent } from "../actions/action";
import { useStudentStore } from "../store";

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
            "An error occurred while trying to create the student!",
        );
      } else {
        toast.success(
          "Student data has been successfully queued. You will be notified when onboarding is complete",
        );
        actions.resetForm();
        return router.push("/admin/students");
      }
    });
  };

  return { isPending, handleSubmission };
};
