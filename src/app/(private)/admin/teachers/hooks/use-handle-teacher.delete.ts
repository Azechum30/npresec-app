import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useTransition } from "react";
import { deleteTeacherRequest } from "../actions/server";
import { toast } from "sonner";
import { useState } from "react";

export const useHandleTeacherDelete = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { id } = useGenericDialog();

  const handleTeacherDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteTeacherRequest(id as string);
      if (!res.success || res.error) {
        setError(res.error || "Failed to delete teacher");
        setSuccess(false);
        return;
      }
      setError("");
      setSuccess(true);
    });
  };

  return { handleTeacherDelete, isDeleting, success, error };
};
