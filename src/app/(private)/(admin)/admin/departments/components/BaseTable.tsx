import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

type BaseTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export default function BaseTable<TData, TValue>({
  columns,
  data,
}: BaseTableProps<TData, TValue>) {
  const memoizedColums = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    columns: memoizedColums,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className="table-auto whitespace-nowrap">
      <TableHeader className="bg-secondary">
        {table.getHeaderGroups().map((headerGroups) => (
          <TableRow key={headerGroups.id} className="bg-secondary">
            {headerGroups.headers.map((header) => (
              <TableHead key={header.id} className="bg-secondary">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table?.getRowModel()?.rows?.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
