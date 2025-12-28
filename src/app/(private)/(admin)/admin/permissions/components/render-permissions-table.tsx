"use client";

import DataTable from "@/components/customComponents/data-table";
import { FC, useEffect, useRef, useState } from "react";
import { useGetPermissionsColumns } from "../hooks/use-get-permission-columns";
import { getPermissions } from "../actions/queries";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useHandleBulkPermissionDelete } from "../hooks/use-handle-bulk-permission-delete";
import { toast } from "sonner";
import { NotFoundIds } from "@/components/customComponents/not-found-Ids";

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
        <NoDataFound />
      ) : (
        <DataTable
          columns={columns}
          data={permissions}
          onDelete={async (rows) => {
            const rowIds = rows.map((row) => row.original.id);
            handleBulkPermissionDelete(rowIds);
          }}
        />
      )}
      {notFoundIds && <NotFoundIds missingIds={notFoundIds} />}
    </>
  );
};
