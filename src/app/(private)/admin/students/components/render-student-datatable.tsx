"use client";

import { FC, use, useEffect, useMemo, useTransition } from "react";
import { useGetColumns } from "./studentColumns";
import { useStudentDataStore } from "@/hooks/use-generic-store";
import DataTable from "@/components/customComponents/data-table";
import { StudentResponseType } from "@/lib/types";
import { useBulkDeleteStudents } from "../hooks/use-bulk-delete-students";
import LoadingState from "@/components/customComponents/Loading";
import { studentTransformer } from "../utils/utils";
import { useDeleteStudent } from "../hooks/use-delete-student";
import StudentRowDetail from "./StudentRowDetail";

type StudentDataTableProps = {
  initialState: Promise<{
    students?: StudentResponseType[];
    error?: string;
  }>;
};

export const StudentDataTable: FC<StudentDataTableProps> = ({
  initialState,
}) => {
  const columns = useGetColumns();
  const { intialState: storeState, setData } = useStudentDataStore();

  const promiseResult = use(initialState);

  const { deleteStudents, isPending } = useBulkDeleteStudents();
  const { isPending: isDeletePending } = useDeleteStudent();

  useEffect(() => {
    if (promiseResult.students && !promiseResult.error) {
      setData(promiseResult.students);
    }
  }, [promiseResult, setData]);

  if (promiseResult.error) {
    return <div className="text-red-500">An error has Occurred!</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={storeState}
        transformer={studentTransformer}
        filename="Students-list"
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          const stIds = rows.map((row) => row.original.studentNumber);
          await deleteStudents(ids, stIds);
        }}
        renderSubComponent={(row) => <StudentRowDetail row={row} />}
      />

      {isPending && <LoadingState />}
      {isDeletePending && <LoadingState />}
    </>
  );
};
