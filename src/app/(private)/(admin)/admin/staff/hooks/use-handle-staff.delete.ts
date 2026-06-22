/** biome-ignore-all assist/source/organizeImports: reason */
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useState, useTransition } from "react";
import { deleteStaffRequest } from "../actions/server";

export const useHandleStaffDelete = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { id } = useGenericDialog();

  const handleStaffDelete = async () => {
    startDeleteTransition(async () => {
      await deleteStaffRequest(id as string);
      // if (!res.success || res.error) {
      //   setError(res.error || "Failed to delete staff");
      //   setSuccess(false);
      //   return;
      // }
      setError("");
      setSuccess(true);
    });
  };

  return { handleStaffDelete, isDeleting, success, error };
};
