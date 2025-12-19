import { useState, useTransition } from "react";
import { bulkDeletePermissions } from "../actions/mutations";

export const useHandleBulkPermissionDelete = () => {
  const [isBulkPermissionDeletePending, startBulkPermissionTransition] =
    useTransition();
  const [bulkDeleteErrror, setBulkDeleteError] = useState<string | null>(null);
  const [isBulkDeleteSuccess, setIsBulkDeleteSuccess] =
    useState<boolean>(false);
  const [deleteCount, setDeleteCount] = useState<number | undefined>(0);
  const [notFoundIds, setNotFoundIds] = useState<string[] | null>(null);

  const handleBulkPermissionDelete = (ids: string[]) => {
    setBulkDeleteError(null);
    setDeleteCount(0);
    setIsBulkDeleteSuccess(false);
    setNotFoundIds(null);
    startBulkPermissionTransition(async () => {
      const { error, count, missingIds } = await bulkDeletePermissions(ids);

      if (error) {
        setBulkDeleteError(error);
        return;
      } else {
        if (missingIds) {
          setNotFoundIds(missingIds);
        }
        setDeleteCount(count);
        setIsBulkDeleteSuccess(true);
      }
    });
  };

  return {
    isBulkPermissionDeletePending,
    deleteCount,
    bulkDeleteErrror,
    isBulkDeleteSuccess,
    notFoundIds,
    handleBulkPermissionDelete,
  };
};
