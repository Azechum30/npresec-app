/**biome-ignore-all assist/source/organizeImports:reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetTemplatesColumns } from "../hooks/use-get-templates-columns";
import { useDeleteDocumentTemplatesMutationFn } from "../mutations";
import { templatesQueries } from "../queries";

export const RenderTemplatesTable = () => {
  const { data } = useSuspenseQuery(templatesQueries);
  const columns = useGetTemplatesColumns();
  const { mutateAsync } = useDeleteDocumentTemplatesMutationFn();

  return (
    <DataTable
      columns={columns}
      data={data}
      onDelete={async (rows) =>
        await Promise.try(async () =>
          mutateAsync({ templateIds: rows.map((row) => row.original.id) }),
        )
      }
    />
  );
};
