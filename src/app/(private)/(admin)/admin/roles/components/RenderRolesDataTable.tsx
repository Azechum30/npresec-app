/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useGetRolesColumns } from "@/app/(private)/(admin)/admin/roles/hooks/use-get-roles-columns";
import DataTable from "@/components/customComponents/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { rolesQueryOptions } from "../actions/tanstack-queries";

export const RenderRolesDataTable = () => {
  const columns = useGetRolesColumns();
  const { data } = useSuspenseQuery(rolesQueryOptions);

  return (
    <DataTable
      columns={columns}
      data={data}
      onDelete={async (rows) => {
        const ids = rows.map((row) => row.original.id);
        // await handleBulkRoleDelete(ids);
      }}
    />
  );
};
