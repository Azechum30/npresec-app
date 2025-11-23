import { TeacherEditType, TeacherType } from "@/lib/validation";
import { useState, useTransition } from "react";
import { updateTeacher } from "../actions/server";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleTeacherUpdate = () => {
  const [isUpdating, startTransition] = useTransition();
  const { id } = useGenericDialog();
  const [updateError, setUpdateError] = useState("");
  const [updateSucess, setUpdateSuccess] = useState(false);

  const handleTeacherUpdate = async (data: TeacherType) => {
    startTransition(async () => {
      const res = await updateTeacher(id as string, data);
      if (res?.error) {
        setUpdateError(res.error || "Could not save changes to teacher data");
        setUpdateSuccess(false);
        return;
      }
      setUpdateError("");
      setUpdateSuccess(true);
    });
  };
  return { handleTeacherUpdate, isUpdating, updateError, updateSucess };
};
