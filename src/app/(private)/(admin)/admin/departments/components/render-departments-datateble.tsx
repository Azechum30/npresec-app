/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeleteDepartmentsMutationFn } from "../actions/mutations";
import { departmentsQueryOptions } from "../actions/queries";
import { departmentTransformer } from "../utils/department-transformer";
import { useGetDepartmentColumns } from "./columns";
import DepartmentRowDetail from "./DepartmentRowDetail";

export default function RenderDepartmentsDataTable() {
  const columns = useGetDepartmentColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const transformer = useMemo(
    () => departmentTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { data, error } = useSuspenseQuery({
    ...departmentsQueryOptions,
  });

  const { mutateAsync } = useDeleteDepartmentsMutationFn();

  return (
    <>
      {error ? (
        <ErrorComponent error={error.message} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          transformer={transformer}
          filename="Departments-list"
          exportKey="departments"
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id as string);
            await mutateAsync({ ids });
          }}
          renderSubComponent={(row) => <DepartmentRowDetail row={row} />}
        />
      )}
    </>
  );
}
