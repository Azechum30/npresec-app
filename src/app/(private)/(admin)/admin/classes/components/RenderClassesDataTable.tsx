"use client";

import React, { useMemo } from "react";
import { useGetClassesColumns } from "./ClassesColumns";
import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import ClassDetailRow from "./ClassDetailRow";
import { useDeleteClass } from "../hooks/use-delete-class";
import { useBulkDeleteClasses } from "../hooks/use-bulk-delete-classes";
import { classTransformer } from "../utils/class-transformer";
import { getClassesAction } from "../actions/server-actions";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

type RenderClassesDataTableProps = {
  initialState: Awaited<ReturnType<typeof getClassesAction>>;
};

const RenderClassesDataTable: React.FC<RenderClassesDataTableProps> = ({
  initialState,
}) => {
  const columns = useGetClassesColumns();
  const { isPending: isDeletePending } = useDeleteClass();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const { deleteclasses } = useBulkDeleteClasses();

  const classDataTransformer = useMemo(
    () => classTransformer(preferredDateFormat),
    [preferredDateFormat]
  );

  return (
    <React.Fragment>
      {initialState.error ? (
        <ErrorComponent error={initialState.error} />
      ) : initialState.data === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          columns={columns}
          data={initialState.data}
          transformer={classDataTransformer}
          filename="Classes-list"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            const codes = rows.map((row) => row.original.code);
            await deleteclasses(ids, codes);
          }}
          renderSubComponent={(row) => <ClassDetailRow row={row} />}
        />
      )}
      {isDeletePending && <LoadingState />}
    </React.Fragment>
  );
};

export default RenderClassesDataTable;
