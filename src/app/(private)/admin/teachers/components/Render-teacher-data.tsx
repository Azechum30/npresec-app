"use client";

import { useTeacherStore } from "@/hooks/use-generic-store";
import { useGetTeacherColumns } from "./TeacherColumns";
import { use, useEffect } from "react";
import { getTeachers } from "../actions/server";
import DataTable from "@/components/customComponents/data-table";
import TeacherRowDetail from "./TeacherRowDetail";
import { useDeleteTeacher } from "../hooks/use-delete-teacher";
import LoadingState from "@/components/customComponents/Loading";
import { useBulkDeleteTeachers } from "../hooks/use-bulk-delete-teachers";
import { TeacherTransformer } from "../utils/teacher-transformer";

type Props = {
  initialState: Promise<Awaited<ReturnType<typeof getTeachers>>>;
};

export default function RenderTeacherData({ initialState }: Props) {
  const { intialState: storeState, setData } = useTeacherStore();
  const columns = useGetTeacherColumns();

  const promise = use(initialState);
  const { isPending: isDeletePending } = useDeleteTeacher();
  const { deleteteachers, isPending } = useBulkDeleteTeachers();

  useEffect(() => {
    if (!promise.error && promise.teachers !== undefined) {
      setData(promise.teachers);
    }
  }, [promise.teachers, setData]);

  if (isDeletePending || isPending) {
    return <LoadingState />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={storeState}
        transformer={TeacherTransformer}
        filename="Teacher-list"
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          const employeeIds = rows.map((row) => row.original.employeeId);
          await deleteteachers(ids, employeeIds);
        }}
        renderSubComponent={(row) => <TeacherRowDetail row={row} />}
      />
    </>
  );
}
