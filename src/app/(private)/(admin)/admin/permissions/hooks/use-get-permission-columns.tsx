import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { PermissionResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useHandleDeletePermission } from "./use-handle-delete-permission";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useGetPermissionsColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();
  const { isDeletePending, isSucess, handleDeletePermission, deleteError } =
    useHandleDeletePermission();

  const wasPreviousDeleteError = useRef(false);
  const wassPreviousDeleteSuccess = useRef(false);
  useEffect(() => {
    const wasError = wasPreviousDeleteError.current;

    if (wasError && !isDeletePending && deleteError) {
      toast.error(deleteError);
    }

    wasPreviousDeleteError.current = isDeletePending;
  }, [deleteError, isDeletePending]);

  useEffect(() => {
    const wasSuccess = wassPreviousDeleteSuccess.current;

    if (wasSuccess && !isDeletePending && isSucess) {
      toast.success("Permission deleted successfull");
    }

    wassPreviousDeleteSuccess.current = isDeletePending;
  }, [isSucess, isDeletePending]);

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
    {
      header: "Name",
      accessorFn: (row) => row.name.split(":").join(" "),
    },
    {
      header: "Description",
      accessorFn: (row) => row?.description,
    },
    {
      header: "CreatedAt",
      accessorFn: (row) => formatDate(row.createdAt),
    },
    {
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-permission"
          onDelete={async () => handleDeletePermission(row.original.id)}
          isPending={isDeletePending}
        />
      ),
    },
  ] satisfies ColumnDef<PermissionResponseType>[];
};
