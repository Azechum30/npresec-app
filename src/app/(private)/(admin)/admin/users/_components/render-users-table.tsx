/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeleteUsersMutationFn } from "../_actions/mutations";
import { usersQueryOptions } from "../_actions/queries";
import { useGetUsersColumns } from "../_hooks/use-get-users-columns";
import { exportUsersDataTransformer } from "../_utils/export-users-data-transform";

export const RenderUsersTable = () => {
  const columns = useGetUsersColumns();

  const { preferredDateFormat } = useUserPreferredDateFormat();

  const userDataTransformer = useMemo(
    () => exportUsersDataTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { mutateAsync } = useDeleteUsersMutationFn();

  const { data } = useSuspenseQuery(usersQueryOptions);

  return (
    <DataTable
      columns={columns}
      data={data}
      onDelete={async (rows) => {
        const ids = rows.map((r) => r.original.id);
        await Promise.try(async () => await mutateAsync({ ids }));
      }}
      transformer={userDataTransformer}
      filename="users-list"
    />
  );
};
