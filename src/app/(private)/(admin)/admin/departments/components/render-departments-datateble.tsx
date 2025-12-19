"use client";

import { useGetDepartmentColumns } from "./columns";
import DataTable from "@/components/customComponents/data-table";
import { getServerSideProps } from "../actions/getServerSideProps";
import DepartmentRowDetail from "./DepartmentRowDetail";
import { useDeleteDepartment } from "../hooks/use-delete-department";
import LoadingState from "@/components/customComponents/Loading";
import { useBulkDeleteDepartments } from "../hooks/use-bulk-delete-departments";
import { departmentTransformer } from "../utils/department-transformer";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useMemo } from "react";

type RenderProps = {
  initialState: Awaited<ReturnType<typeof getServerSideProps>>;
};

export default function RenderDepartmentsDataTable({
  initialState,
}: RenderProps) {
  const columns = useGetDepartmentColumns();
  const { isPending } = useDeleteDepartment();
  const { deletedepartments } = useBulkDeleteDepartments();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const transformer = useMemo(
    () => departmentTransformer(preferredDateFormat),
    [preferredDateFormat]
  );

  return (
    <>
      {initialState.error ? (
        <ErrorComponent error={initialState.error} />
      ) : initialState.departments === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          columns={columns}
          data={initialState.departments}
          transformer={transformer}
          filename="Departments-list"
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id as string);
            const codes = row.map((r) => r.original.code);
            await deletedepartments(ids, codes);
          }}
          renderSubComponent={(row) => <DepartmentRowDetail row={row} />}
        />
      )}

      {isPending && <LoadingState />}
    </>
  );
}
