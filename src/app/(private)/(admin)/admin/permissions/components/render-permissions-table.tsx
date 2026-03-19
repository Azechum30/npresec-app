"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NotFoundIds } from "@/components/customComponents/not-found-Ids";
import { Notification } from "@/components/customComponents/notification";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getPermissions } from "../actions/queries";
import { useGetPermissionsColumns } from "../hooks/use-get-permission-columns";
import { useHandleBulkPermissionDelete } from "../hooks/use-handle-bulk-permission-delete";

type RenderPermissionTableProps = {
  permissions?: Awaited<ReturnType<typeof getPermissions>>["permissions"];
  error?: string;
};

export const RenderPermissionsTable = ({
  permissions,
  error,
}: RenderPermissionTableProps) => {
  const columns = useGetPermissionsColumns();
  const {
    bulkDeleteErrror,
    deleteCount,
    handleBulkPermissionDelete,
    isBulkDeleteSuccess,
    isBulkPermissionDeletePending,
    notFoundIds,
  } = useHandleBulkPermissionDelete();

  const wasPreviousBulkDeleteError = useRef(false);
  const wasPreviousBulkDeleteSuccess = useRef(false);

  useEffect(() => {
    const wasBulkDeleteError = wasPreviousBulkDeleteError.current;
    if (
      wasBulkDeleteError &&
      !isBulkPermissionDeletePending &&
      bulkDeleteErrror
    ) {
      toast.error(bulkDeleteErrror);
    }
    wasPreviousBulkDeleteError.current = isBulkPermissionDeletePending;
  }, [isBulkPermissionDeletePending, bulkDeleteErrror]);

  useEffect(() => {
    const wasBulkDeleteSuccess = wasPreviousBulkDeleteSuccess.current;
    if (
      wasBulkDeleteSuccess &&
      !isBulkPermissionDeletePending &&
      isBulkDeleteSuccess
    ) {
      toast.success(`${deleteCount} permission(s) were/was deleted!`);
    }
    wasPreviousBulkDeleteSuccess.current = isBulkPermissionDeletePending;
  }, [isBulkPermissionDeletePending, isBulkDeleteSuccess, deleteCount]);

  return (
    <>
      {error ? (
        <ErrorComponent error={error} />
      ) : permissions === undefined ? (
        <Notification />
      ) : permissions.length > 0 ? (
        <DataTable
          columns={columns}
          data={permissions}
          onDelete={async (rows) => {
            const rowIds = rows.map((row) => row.original.id);
            handleBulkPermissionDelete(rowIds);
          }}
        />
      ) : (
        <Notification description="No permissions were found from the database server." />
      )}
      {notFoundIds && <NotFoundIds missingIds={notFoundIds} />}
    </>
  );
};
