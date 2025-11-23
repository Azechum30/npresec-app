import { useTransition, useState } from "react";
import { handleUpdateBoardMemberAction } from "../_actions/handle-update-board-member";
import { BoardOfGovernorsType } from "@/lib/validation";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleUpdateBoardMember = () => {
  const [isUpdating, startUpdateTransition] = useTransition();
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { id } = useGenericDialog();

  const handleUpdateBoardMember = async (values: BoardOfGovernorsType) => {
    startUpdateTransition(async () => {
      const { error, boardMember } = await handleUpdateBoardMemberAction({
        ...values,
        id: id as string,
      });
      if (error) {
        setUpdateError(error);
        setUpdateSuccess(false);
        return;
      }
      if (!boardMember) {
        setUpdateError("");
        setUpdateSuccess(false);
        return;
      }
      setUpdateError("");
      setUpdateSuccess(true);
    });
  };

  return { handleUpdateBoardMember, isUpdating, updateError, updateSuccess };
};
