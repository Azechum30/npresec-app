/** biome-ignore-all assist/source/organizeImports:reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useDeleteClassesMutationFn } from "../actions/mutations";
import { classQueryOptions } from "../actions/queries";
import { classTransformer } from "../utils/class-transformer";
import ClassDetailRow from "./ClassDetailRow";
import { useGetClassesColumns } from "./ClassesColumns";

const RenderClassesDataTable: React.FC = () => {
  const columns = useGetClassesColumns();

  const { preferredDateFormat } = useUserPreferredDateFormat();

  const { mutateAsync } = useDeleteClassesMutationFn();

  const classDataTransformer = useMemo(
    () => classTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { data, error } = useSuspenseQuery({
    ...classQueryOptions,
  });

  return (
    <React.Fragment>
      {error ? <ErrorComponent error={error.message} /> : null}
      {data && (
        <DataTable
          columns={columns}
          data={data}
          transformer={classDataTransformer}
          filename="Classes-list"
          exportKey="classes"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            Promise.try(async () => await mutateAsync({ ids }));
          }}
          renderSubComponent={(row) => <ClassDetailRow row={row} />}
        />
      )}
    </React.Fragment>
  );
};

export default RenderClassesDataTable;
