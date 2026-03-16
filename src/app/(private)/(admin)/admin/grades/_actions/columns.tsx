import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { CourseAggregateScore } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns = [
  {
    header: "CourseCode",
    accessorFn: (row) => row.code,
  },
  {
    header: "CourseTitle",
    accessorFn: (row) => row.title,
  },
  {
    header: "CreditHours",
    accessorKey: "credits",
  },
  {
    header: "CreditPoints",
    accessorFn: (row) => row.points.toFixed(2),
  },
  {
    header: "TotalWeight",
    accessorFn: (row) => row.totalWeighted.toFixed(2) + "%",
  },
  {
    header: "Grade",
    accessorFn: (row) => row.letter,
  },
  {
    header: "GradePoint",
    accessorFn: (row) => (row.credits! * row.points).toFixed(2),
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
] satisfies ColumnDef<CourseAggregateScore>[];
