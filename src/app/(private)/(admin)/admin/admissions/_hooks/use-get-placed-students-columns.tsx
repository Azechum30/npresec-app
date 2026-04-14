import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { PlacementListType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";
import z from "zod";
import { deletePlacedStudentById } from "../_actions/server-only-actions";

const ID = z.cuid();

export const useGetPlacedStudentsColumns = () => {
  const [isPending, startTransition] = useTransition();

  const handlePlacedStudentDelete = (id: z.ZodCUID) => {
    startTransition(async () => {
      const { error, success } = await deletePlacedStudentById(id);

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("Placed student deleted successfully");
      }
    });
  };
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
      header: "Index Number",
      accessorFn: (row) => row.jhsIndexNumber,
    },

    {
      header: "Fullname",
      accessorFn: (row) => `${row.lastName} ${row.otherNames}`,
    },

    {
      header: "Contact",
      accessorFn: (row) => row.guardianPhoneNumber,
    },
    {
      header: "Course",
      accessorFn: (row) => row.programme,
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          onDelete={async () =>
            handlePlacedStudentDelete(
              row.original.id as typeof z.ZodCUID.prototype,
            )
          }
          secondaryKey="id"
          dialogId="edit-admission"
          isPending={isPending}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<PlacementListType>[];
};
