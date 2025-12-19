import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useTransition } from "react";
import { deleteStaffRequest } from "../actions/server";
import { toast } from "sonner";
import { useState } from "react";

export const useHandleStaffDelete = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { id } = useGenericDialog();

  const handleStaffDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteStaffRequest(id as string);
      if (!res.success || res.error) {
        setError(res.error || "Failed to delete staff");
        setSuccess(false);
        return;
      }
      setError("");
      setSuccess(true);
    });
  };

  return { handleStaffDelete, isDeleting, success, error };
};
