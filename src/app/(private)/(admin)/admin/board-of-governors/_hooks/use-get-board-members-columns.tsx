import { ColumnDef } from "@tanstack/react-table";
import { BoardMemberResponseType } from "@/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useHandleDeleteBoardMember } from "./use-handle-delete-board-member";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";

export const useGetBoardMembersColumns = () => {
  const { handleDeleteBoardMember, isDeleting, error, success } =
    useHandleDeleteBoardMember();

  const prevErrorRef = useRef<boolean>(false);
  useEffect(() => {
    const wasError = prevErrorRef.current;
    if (wasError && !isDeleting && error) {
      toast.error(error);
    }
    prevErrorRef.current = isDeleting;
  }, [error, isDeleting]);

  useEffect(() => {
    if (success && !isDeleting) {
      toast.success("Board member deleted successfully");
    }
  }, [success, isDeleting]);

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => {
        const url = row.original.picture
          ? row.original.picture.startsWith("http") ||
            row.original.picture.startsWith("https") ||
            row.original.picture.startsWith("/")
            ? row.original.picture
            : "/no-avatar.jpg"
          : "/no-avatar.jpg";

        return (
          <div className="size-10 rounded-full border-2 p-1 flex items-center justify-center">
            <Image
              src={url}
              alt={row.original.name}
              width={32}
              height={30}
              className="rounded-full object-cover object-top w-8 h-7"
            />
          </div>
        );
      },
    },
    {
      header: "Full Name",
      accessorKey: "name",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const role =
          row.original.role === "ChairPerson"
            ? "Chairperson"
            : row.original.role === "ViceChairPerson"
              ? "Vice Chairperson"
              : row.original.role;
        return <div>{role}</div>;
      },
    },
    {
      header: "Affiliation",
      accessorKey: "affiliation",
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.is_active ? "secondary" : "destructive"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            dialogId="edit-board-of-governor"
            secondaryKey="id"
            onDelete={() => handleDeleteBoardMember(row.original.id)}
            isPending={isDeleting}
          />
        );
      },
    },
    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableHiding: false,
      enableGlobalFilter: false,
    },
  ] satisfies ColumnDef<BoardMemberResponseType>[];
};
