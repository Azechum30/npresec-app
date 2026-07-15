/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useGetRolesColumns } from "@/app/(private)/(admin)/admin/roles/hooks/use-get-roles-columns";
import DataTable from "@/components/customComponents/data-table";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { rolesTransformer } from "../actions/roles-transformer";
import { useDeleteRolesMutationFn } from "../actions/tanstack-mutations";
import { rolesQueryOptions } from "../actions/tanstack-queries";

export const RenderRolesDataTable = () => {
  const columns = useGetRolesColumns();
  const { data } = useSuspenseQuery(rolesQueryOptions);
  const { mutateAsync } = useDeleteRolesMutationFn();

  const { preferredDateFormat } = useUserPreferredDateFormat();
  const roleTransformerFn = useMemo(
    () => rolesTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  return (
    <DataTable
      filename="System-roles"
      transformer={roleTransformerFn}
      exportKey="roles"
      columns={columns}
      data={data}
      onDelete={async (rows) => {
        const ids = rows.map((row) => row.original.id);
        await Promise.try(async () => {
          await mutateAsync(ids);
        });
      }}
    />
  );
};
