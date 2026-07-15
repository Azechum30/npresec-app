/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetHouseColumns } from "../_hooks/use-get-house-columns";
import { useDeleteHousesMutationFn } from "../mutations";
import { housesQueryOptions } from "../queries";

export const RenderHouseListTable = () => {
  const columns = useGetHouseColumns();
  const { data } = useSuspenseQuery(housesQueryOptions);
  const { mutateAsync } = useDeleteHousesMutationFn();

  return (
    <DataTable
      data={data}
      columns={columns}
      onDelete={async (rows) => {
        const ids = rows.map((row) => row.original.id);
        await Promise.try(async () => await mutateAsync({ ids }));
      }}
    />
  );
};
