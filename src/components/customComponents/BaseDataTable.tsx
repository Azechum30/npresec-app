import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";

type BaseDatatableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export const BaseDataTable = <TData, TValue>({
  columns,
  data,
}: BaseDatatableProps<TData, TValue>) => {
   
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroups) => (
            <TableRow
              key={headerGroups.id}
              className="bg-blue-50 dark:bg-blue-900/20">
              {headerGroups.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-blue-800 dark:text-blue-200">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No Rows Found!</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
