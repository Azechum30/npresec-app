"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import DataTable from "@/components/customComponents/data-table";
import { Notification } from "@/components/customComponents/notification";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import React, { useMemo } from "react";
import { getClassesAction } from "../actions/server-actions";
import { useBulkDeleteClasses } from "../hooks/use-bulk-delete-classes";
import { useDeleteClass } from "../hooks/use-delete-class";
import { classTransformer } from "../utils/class-transformer";
import ClassDetailRow from "./ClassDetailRow";
import { useGetClassesColumns } from "./ClassesColumns";

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
    [preferredDateFormat],
  );

  return (
    <React.Fragment>
      {initialState.error ? (
        <>
          <ErrorComponent error={initialState.error} />
          {(initialState.error = "")}
        </>
      ) : null}
      {initialState.data === undefined ? (
        <Notification description="Please wait while the data is being retrieved from the server. This is may take some time because of latency and other network traffic limitations." />
      ) : initialState.data.length > 0 ? (
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
      ) : (
        <Notification description="No data was found. Possibly, there are no records or entries made for classes in the database server." />
      )}
      {isDeletePending && (
        <ShowLoadingState title="Kindly wait while the request is being processed..." />
      )}
    </React.Fragment>
  );
};

export default RenderClassesDataTable;
