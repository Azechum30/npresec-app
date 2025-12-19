import { useTransition, useState } from "react";
import { handleBulkBoardMembersDeleteAction } from "../_actions/handle-bulk-board-members-delete";

export const useHandleBulkBoardMembersDelete = () => {
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [bulkDeletePending, startBulkDeleteTransition] = useTransition();
  const [recordCount, setRecordCount] = useState(0);

  const handleBulkBoardMembersDelete = async (ids: string[]) => {
    startBulkDeleteTransition(async () => {
      const { error, deleteCount } =
        await handleBulkBoardMembersDeleteAction(ids);
      if (error) {
        setDeleteError(error);
        setDeleteSuccess(false);
        setRecordCount(0);
        return;
      }

      if (!deleteCount) {
        setDeleteError("");
        setDeleteSuccess(false);
        setRecordCount(0);
        return;
      }

      setDeleteError("");
      setDeleteSuccess(true);
      setRecordCount(deleteCount);
    });
  };

  return {
    deleteError,
    deleteSuccess,
    recordCount,
    bulkDeletePending,
    handleBulkBoardMembersDelete,
  };
};
