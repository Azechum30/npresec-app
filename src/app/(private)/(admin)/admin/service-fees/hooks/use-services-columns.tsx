import { GenericActions } from "@/components/customComponents/GenericActions";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteServiceById } from "../_actions/delete-service-by-id";
import { TServiceOutput } from "../_components/render-services-tb";

export const useGetServiceColumns = () => {
  const [isPending, startTransition] = useTransition();

  const handleServiceDelete = (id: string) => {
    startTransition(async () => {
      const { error, success } = await deleteServiceById(id);

      if (error) {
        toast.error(error);
        return;
      } else if (success) {
        toast.success("service deleted");
      }
    });
  };

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections table={table} isHeader />,
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
      header: "ServiceName",
      accessorFn: (row) => row.name,
    },
    {
      header: "AcademicY",
      accessorFn: (row) => row.academicYear,
    },
    {
      header: "Price",
      accessorFn: (row) => row.price,
    },
    {
      header: "Capacity",
      accessorFn: (row) => row.capacity,
    },
    {
      header: "EnrollCount",
      accessorFn: (row) => row.count,
    },
    {
      header: "Deadline",
      accessorFn: (row) =>
        new Intl.DateTimeFormat("en-GH", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }).format(row.deadline),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-service"
          onDelete={async () => handleServiceDelete(row.original.id)}
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

    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<TServiceOutput>[];
};
