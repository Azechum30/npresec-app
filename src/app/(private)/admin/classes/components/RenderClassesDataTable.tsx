"use client";

import React, { use, useEffect, useTransition } from "react";
import { useGetClassesColumns } from "./ClassesColumns";
import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import { useClassesStore } from "@/hooks/use-generic-store";
import ClassDetailRow from "./ClassDetailRow";
import { useDeleteClass } from "../hooks/use-delete-class";
import { useBulkDeleteClasses } from "../hooks/use-bulk-delete-classes";
import { ClassesResponseType } from "@/lib/types";
import { classTransformer } from "../utils/class-transformer";

type RenderClassesDataTableProps = {
  initialState: Promise<{
    data?: ClassesResponseType[];
    error?: string;
  }>;
};

const RenderClassesDataTable: React.FC<RenderClassesDataTableProps> = ({
  initialState,
}) => {
  const { intialState: storeState, setData } = useClassesStore();

  const promise = use(initialState);
  const columns = useGetClassesColumns();
  const { isPending: isDeletePending } = useDeleteClass();
  const { deleteclasses } = useBulkDeleteClasses();

  useEffect(() => {
    if (!promise.error && promise.data) {
      setData(promise.data);
    }
  }, [promise.data, setData]);

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={storeState}
        transformer={classTransformer}
        filename="Classes-list"
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          const codes = rows.map((row) => row.original.code);
          await deleteclasses(ids, codes);
        }}
        renderSubComponent={(row) => <ClassDetailRow row={row} />}
      />
      {isDeletePending && <LoadingState />}
    </React.Fragment>
  );
};

export default RenderClassesDataTable;
