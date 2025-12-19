import { useTransition } from "react";
import { useState } from "react";
import { handleBoardMemberDelete } from "../_actions/handle-board-member-delete";

export const useHandleDeleteBoardMember = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDeleteBoardMember = async (id: string) => {
    startDeleteTransition(async () => {
      const res = await handleBoardMemberDelete(id as string);
      if (res.error) {
        setError(res.error);
        setSuccess(false);
        return;
      }
      setError("");
      setSuccess(true);
    });
  };

  return { handleDeleteBoardMember, isDeleting, error, success };
};
