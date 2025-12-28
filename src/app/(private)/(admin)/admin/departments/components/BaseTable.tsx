import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
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
      <TableHeader>
        {table.getHeaderGroups().map((headerGroups) => (
          <TableRow key={headerGroups.id} className="">
            {headerGroups.headers.map((header) => (
              <TableHead key={header.id}>
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
