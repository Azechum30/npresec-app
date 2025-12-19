import { BoardOfGovernorsType } from "@/lib/validation";
import { useTransition } from "react";
import { handleBoardMemberCreationAction } from "../_actions/handle-board-member-creation-action";
import { useState } from "react";

export const useHandleBoardMemberCreation = () => {
  const [isCreating, startTransition] = useTransition();
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const handleBoardMemberCreation = async (data: BoardOfGovernorsType) => {
    startTransition(async () => {
      const res = await handleBoardMemberCreationAction(data);
      if (res.error) {
        setCreateError(res.error);
        setCreateSuccess(false);
        return;
      }
      setCreateError("");
      setCreateSuccess(true);
    });
  };

  return { handleBoardMemberCreation, isCreating, createError, createSuccess };
};
