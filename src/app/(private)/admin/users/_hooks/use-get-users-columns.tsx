import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { UserResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useHandleUserDelete } from "./use-delete-user";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useGetUsersColumns = () => {
  const { onOpen } = useGenericDialog();
  const { handleUserDelete, isError, isDeletePending, isDeleteSuccess } =
    useHandleUserDelete();

  const wasDeleteErrorRef = useRef(false);
  const wasDeleteSuccessRef = useRef(false);
  useEffect(() => {
    const wasDeleteError = wasDeleteErrorRef.current;

    if (wasDeleteError && !isDeletePending && isError) {
      toast.error(isError);
      return;
    }
    wasDeleteErrorRef.current = isDeletePending;
  }, [isError, isDeletePending]);

  useEffect(() => {
    const wasDeleteSuccess = wasDeleteSuccessRef.current;

    if (wasDeleteSuccess && !isDeletePending && isDeleteSuccess) {
      toast.success("User deleted successfully");
      return;
    }
    wasDeleteSuccessRef.current = isDeletePending;
  }, [isDeleteSuccess, isDeletePending]);

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableGrouping: false,
      enableResizing: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => {
        const url = row.original.picture;
        const isValid =
          url?.startsWith("http") ||
          url?.startsWith("https") ||
          url?.startsWith("/");
        const src = isValid ? url : "/no-avatar.jpg";
        return (
          <div className="size-8 rounded-full border p-1 flex justify-center items-center">
            <Image
              src={src ?? "/no-avatar.jpg"}
              alt="Avatar"
              width={20}
              height={20}
              className="size-6 rounded-full object-cover object-top"
            />
          </div>
        );
      },
    },
    {
      header: "Email",
      accessorFn: (row) => row.email,
    },
    {
      header: "Username",
      accessorFn: (row) => row.username,
    },
    {
      header: "Role",
      accessorFn: (row) => row.role?.name.toUpperCase(),
    },

    {
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge
            variant={
              row.original.resetPasswordRequired ? "destructive" : "secondary"
            }>
            {row.original.resetPasswordRequired ? "Not Verified" : "Verified"}
          </Badge>
        );
      },
    },
    {
      header: "Edit Permissions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpen("update-user-permissions", row.original.id)}>
            <PencilIcon />
            Edit
          </Button>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <GenericActions
            secondaryKey="id"
            dialogId="update-user-role"
            row={row}
            onDelete={async () => handleUserDelete({ id })}
            key={row.original.id}
            isPending={isDeletePending}
          />
        );
      },
    },
  ] satisfies ColumnDef<UserResponseType>[];
};
