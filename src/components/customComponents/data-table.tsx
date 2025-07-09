import TableFooterDescription from "@/components/customComponents/TableFooterData";
import TopActions from "@/components/customComponents/TopActions";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import { TransformerFn } from "@/utils/createDataTransformer";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  getExpandedRowModel,
  ExpandedState,
  RowSelectionState,
} from "@tanstack/react-table";
import { IContent } from "json-as-xlsx";
import React, { JSX, useState } from "react";

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  filename?: string;
  transformer?: TransformerFn<TData>;
  renderSubComponent?: (row: Row<TData>) => JSX.Element;
  onDelete?: (rows: Row<TData>[]) => void;
};

const DataTable = <TData,>({
  columns,
  data,
  transformer,
  filename,
  renderSubComponent,
  onDelete,
}: DataTableProps<TData>) => {
  const [sorting, setIsSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setIsSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      expanded,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  });

  return (
    <div className="mt-4 relative">
      <TopActions
        table={table}
        onDelete={onDelete}
        data={data}
        transformer={transformer}
        filename={filename}
      />
      <Table className="border mb-2">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroups) => (
            <TableRow key={headerGroups.id} className="bg-secondary">
              {headerGroups.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && renderSubComponent?.(row) && (
                  <TableRow className="bg-background">
                    <TableCell colSpan={row.getVisibleCells().length}>
                      {renderSubComponent(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length}>
                No rows found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <div className='border'>
			</div> */}
      <TableFooterDescription table={table} />
    </div>
  );
};

export default DataTable;
