"use client";

import { useTeacherStore } from "@/hooks/use-generic-store";
import { useGetTeacherColumns } from "./TeacherColumns";
import { useEffect, useMemo } from "react";
import DataTable from "@/components/customComponents/data-table";
import TeacherRowDetail from "./TeacherRowDetail";
import { useBulkDeleteTeachers } from "../hooks/use-bulk-delete-teachers";
import { createTeacherTransformer } from "../utils/teacher-transformer";
import { TeacherResponseType } from "@/lib/types";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { DateFormatType } from "@/lib/validation";

type Props = {
  initialData: { teachers?: TeacherResponseType[]; error?: string };
};

export default function RenderTeacherData({ initialData }: Props) {
  const { intialState: storeState, setData } = useTeacherStore();
  const columns = useGetTeacherColumns();
  const { deleteteachers } = useBulkDeleteTeachers();
  const userPreferredDateFormat = useUserPreferredDateFormat();
  const teacherTransformer = useMemo(
    () => createTeacherTransformer(userPreferredDateFormat as DateFormatType),
    [userPreferredDateFormat]
  );

  useEffect(() => {
    if (!initialData.error && initialData.teachers !== undefined) {
      setData(initialData.teachers);
    }
  }, [initialData.teachers, setData]);

  return (
    <>
      <DataTable
        columns={columns}
        data={storeState}
        transformer={teacherTransformer}
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
