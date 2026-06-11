import { RowSelections } from "@/components/customComponents/RowSelections";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { toProperCase } from "@/utils/string-transformer";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, View } from "lucide-react";
import { TRenderPayments } from "../_components/render-payments";

export const usePaymentsColumns = () => {
  const { onOpen } = useGenericDialog();
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
      header: "StudentId",
      accessorFn: (row) => row.metadata.studentId,
    },
    {
      header: "Amount",
      accessorFn: (row) => row.amount,
    },
    {
      header: "Fee",
      accessorFn: (row) => row.transactionFee,
    },
    {
      header: "Trans.ID",
      accessorFn: (row) => row.transactionId,
    },
    {
      header: "PayChannel",
      accessorFn: (row) =>
        toProperCase(row.channel?.split("_").join(" ") as string),
    },

    {
      header: "Bank",
      accessorFn: (row) => row.bank,
    },
    {
      header: "PaidAt",
      accessorFn: (row) =>
        new Intl.DateTimeFormat("en-GH", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        }).format(row.paidAt as Date),
    },

    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() =>
                  onOpen(
                    "view-payment-details",
                    String(row.original.transactionId),
                  )
                }>
                <View className=" size-4 text-primary" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] satisfies ColumnDef<TRenderPayments["payments"][0]>[];
};
