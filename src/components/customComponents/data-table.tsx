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
import React, { JSX, useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useAuth } from "./SessionProvider";

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  filename?: string;
  showImportButton?: boolean;
  transformer?: TransformerFn<TData>;
  renderSubComponent?: (row: Row<TData>) => JSX.Element;
  onDelete?: (rows: Row<TData>[]) => void;
};

const DataTable = <TData,>({
  columns,
  data,
  transformer,
  filename,
  showImportButton,
  renderSubComponent,
  onDelete,
}: DataTableProps<TData>) => {
  const user = useAuth();

  const userItemsPerPage = useMemo(() => {
    const validPageSizes = [10, 25, 50, 100];
    const userPreference = user?.itemsPerPage;

    if (
      userPreference &&
      typeof userPreference === "number" &&
      validPageSizes.includes(userPreference)
    ) {
      return userPreference;
    }
    return 10;
  }, [user?.itemsPerPage]);

  const [sorting, setIsSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: userItemsPerPage,
  }));
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (pagination.pageSize !== userItemsPerPage) {
      setPagination((prev) => ({
        ...prev,
        pageSize: userItemsPerPage,
        pageIndex: 0,
      }));
    }
  }, [userItemsPerPage, pagination.pageSize]);

  const memoizedColums = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

   
  const table = useReactTable({
    columns: memoizedColums,
    data: memoizedData,
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
    <Card className="mt-4 relative">
      <CardHeader>
        <TopActions
          table={table}
          onDelete={onDelete}
          data={data}
          transformer={transformer}
          filename={filename}
          showImportButton={showImportButton}
        />
      </CardHeader>
      <CardContent>
        <Table className="border mb-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroups) => (
              <TableRow key={headerGroups.id} className="bg-accent">
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
                  {row.getIsExpanded() && renderSubComponent && (
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
      </CardContent>

      <CardFooter>
        <TableFooterDescription
          table={table}
          pageSizeOptions={
            userItemsPerPage as unknown as { itemsPerPage: 10 | 25 | 50 | 100 }
          }
        />
      </CardFooter>
    </Card>
  );
};

export default DataTable;
