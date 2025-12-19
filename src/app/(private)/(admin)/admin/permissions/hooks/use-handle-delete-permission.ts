import { useState, useTransition } from "react";
import { deletePermission } from "../actions/mutations";

export const useHandleDeletePermission = () => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSucess, setIsSuccess] = useState<boolean>(false);

  const handleDeletePermission = (id: string) => {
    setDeleteError(null);
    setIsSuccess(false);

    startDeleteTransition(async () => {
      const { error, success } = await deletePermission(id);

      if (error) {
        setDeleteError(error);
        return;
      } else if (success) {
        setIsSuccess(true);
        return;
      }
    });
  };

  return { isDeletePending, handleDeletePermission, isSucess, deleteError };
};
