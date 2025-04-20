"use client";

import { use, useEffect } from "react";
import { useGetDepartmentColumns } from "./columns";
import DataTable from "@/components/customComponents/data-table";
import { useDepartmentStore } from "@/hooks/use-generic-store";
import { getServerSideProps } from "../actions/getServerSideProps";
import DepartmentRowDetail from "./DepartmentRowDetail";
import { useDeleteDepartment } from "../hooks/use-delete-department";
import LoadingState from "@/components/customComponents/Loading";
import { useBulkDeleteDepartments } from "../hooks/use-bulk-delete-departments";
import { departmentTransformer } from "../utils/department-transformer";

type RenderProps = {
  initialState: Promise<Awaited<ReturnType<typeof getServerSideProps>>>;
};

export default function RenderDepartmentsDataTable({
  initialState,
}: RenderProps) {
  const { intialState: storeState, setData } = useDepartmentStore();

  const promise = use(initialState);
  const columns = useGetDepartmentColumns();
  const { isPending } = useDeleteDepartment();
  const { deletedepartments } = useBulkDeleteDepartments();

  useEffect(() => {
    if (!promise.error && promise.departments) {
      setData(promise.departments);
    }
  }, [promise.departments, setData]);

  return (
    <>
      <DataTable
        columns={columns}
        data={storeState}
        transformer={departmentTransformer}
        filename="Departments-list"
        onDelete={async (row) => {
          const ids = row.map((r) => r.original.id as string);
          const codes = row.map((r) => r.original.code);
          await deletedepartments(ids, codes);
        }}
        renderSubComponent={(row) => <DepartmentRowDetail row={row} />}
      />
      {isPending && <LoadingState />}
    </>
  );
}
