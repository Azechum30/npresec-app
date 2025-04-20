import { redirect } from "next/navigation";
import { useStudentStore } from "../store";

export const useCancelEditStudent = () => {
  const { actions } = useStudentStore();

  const handleCancel = () => {
    actions.resetForm();
    redirect("/admin/students");
  };

  return { handleCancel };
};
