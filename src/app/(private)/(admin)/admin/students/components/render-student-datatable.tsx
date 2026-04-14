"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { FC, useMemo } from "react";
import { getStudents } from "../actions/action";
import { useBulkDeleteStudents } from "../hooks/use-bulk-delete-students";
import { useDeleteStudent } from "../hooks/use-delete-student";
import { studentTransformer } from "../utils/utils";
import { useGetColumns } from "./studentColumns";
import StudentRowDetail from "./StudentRowDetail";

type StudentDataTableProps = {
  initialState: Awaited<ReturnType<typeof getStudents>>;
};

export const StudentDataTable: FC<StudentDataTableProps> = ({
  initialState,
}) => {
  const columns = useGetColumns();
  const { deleteStudents, isPending } = useBulkDeleteStudents();
  const { isPending: isDeletePending } = useDeleteStudent();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const transformer = useMemo(
    () => studentTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  return (
    <>
      {initialState.error ? (
        <ErrorComponent error={initialState.error} />
      ) : initialState.students === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          showImportButton={true}
          columns={columns}
          data={initialState.students}
          transformer={transformer}
          filename="Students-list"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            const stIds = rows.map((row) => row.original.studentNumber);
            await deleteStudents(ids, stIds);
          }}
          renderSubComponent={(row) => <StudentRowDetail row={row} />}
        />
      )}
    </>
  );
};
