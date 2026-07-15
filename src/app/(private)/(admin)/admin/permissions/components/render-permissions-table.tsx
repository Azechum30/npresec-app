/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { permissionsQueryOptions } from "../actions/tanstack-queries";
import { useGetPermissionsColumns } from "../hooks/use-get-permission-columns";

export const RenderPermissionsTable = () => {
  const columns = useGetPermissionsColumns();
  const { data } = useSuspenseQuery(permissionsQueryOptions);

  return (
    <DataTable
      columns={columns}
      data={data}
      onDelete={async (rows) => {
        const rowIds = rows.map((row) => row.original.id);
        // handleBulkPermissionDelete(rowIds);
      }}
    />
  );
};
