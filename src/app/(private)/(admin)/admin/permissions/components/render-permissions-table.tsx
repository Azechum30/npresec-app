/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { permissionsTransformer } from "../actions/permissions-transformer";
import { useDeletePermissionsMutationFn } from "../actions/tanstack-mutation";
import { permissionsQueryOptions } from "../actions/tanstack-queries";
import { useGetPermissionsColumns } from "../hooks/use-get-permission-columns";

export const RenderPermissionsTable = () => {
  const columns = useGetPermissionsColumns();
  const { data } = useSuspenseQuery(permissionsQueryOptions);
  const { mutateAsync } = useDeletePermissionsMutationFn();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const permissionsTransformerFn = useMemo(
    () => permissionsTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  return (
    <DataTable
      filename="Permission-List"
      transformer={permissionsTransformerFn}
      columns={columns}
      data={data}
      onDelete={async (rows) => {
        const rowIds = rows.map((row) => row.original.id);
        await Promise.try(async () => {
          await mutateAsync(rowIds);
        });
      }}
    />
  );
};
