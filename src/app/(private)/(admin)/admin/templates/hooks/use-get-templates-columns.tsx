/**biome-ignore-all assist/source/organizeImports:reason */

import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Badge } from "@/components/ui/badge";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import type { TemplateServerResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteDocumentTemplateMutationFn } from "../mutations";

export const useGetTemplatesColumns = () => {
  const { mutateAsync } = useDeleteDocumentTemplateMutationFn();
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
      header: "Type",
      accessorFn: (row) => row.type,
    },
    {
      header: "Template Title",
      accessorFn: (row) => row.documentHeading,
    },
    {
      header: "Status",
      accessorFn: (row) => (row.isActive ? "Active" : "Inactive"),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      filterFn: fuzzyFilter,
    },
    {
      header: "Date Created",
      accessorFn: (row) =>
        new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(
          row.createdAt,
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          dialogId="edit-document-template"
          secondaryKey="id"
          isPending={false}
          onDelete={async () =>
            await Promise.try(
              async () => await mutateAsync({ templateId: row.original.id }),
            )
          }
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
  ] satisfies ColumnDef<TemplateServerResponseType>[];
};
