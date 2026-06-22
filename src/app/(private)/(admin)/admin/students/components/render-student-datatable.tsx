/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeleteStudentsMutationFn } from "../actions/mutations";
import { studentsQueryOptions } from "../actions/queries";
import { studentTransformer } from "../utils/utils";
import { useGetColumns } from "./studentColumns";
import StudentRowDetail from "./StudentRowDetail";

export const StudentDataTable = () => {
  const columns = useGetColumns();

  const { preferredDateFormat } = useUserPreferredDateFormat();
  const transformer = useMemo(
    () => studentTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { data, error } = useSuspenseQuery(studentsQueryOptions);
  const { mutateAsync } = useDeleteStudentsMutationFn();

  return (
    <>
      {error ? (
        <ErrorComponent error={error.message} />
      ) : (
        <DataTable
          showImportButton={true}
          columns={columns}
          data={data}
          transformer={transformer}
          filename="Students-list"
          exportKey="students"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            await Promise.try(async () => mutateAsync(ids));
          }}
          renderSubComponent={(row) => <StudentRowDetail row={row} />}
        />
      )}
    </>
  );
};
