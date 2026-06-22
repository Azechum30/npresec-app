/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeleteStaffsMutationFn } from "../actions/mutations";
import { staffQueryOptions } from "../actions/queries";
import { createStaffTransformer } from "../utils/staff-transformer";
import { useGetStaffColumns } from "./StaffColumns";
import StaffRowDetail from "./StaffRowDetail";

export default function RenderStaffData() {
  const columns = useGetStaffColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const staffTransformer = useMemo(
    () => createStaffTransformer(preferredDateFormat),
    [preferredDateFormat],
  );
  const { mutateAsync } = useDeleteStaffsMutationFn();

  const { data, error } = useSuspenseQuery({
    ...staffQueryOptions,
  });

  return (
    <>
      {error ? (
        <ErrorComponent error={error.message} />
      ) : (
        <DataTable
          showImportButton={true}
          columns={columns}
          data={data}
          transformer={staffTransformer}
          filename="Staff-list"
          exportKey="staff"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            Promise.try(async () => await mutateAsync(ids));
          }}
          renderSubComponent={(row) => <StaffRowDetail row={row} />}
        />
      )}
    </>
  );
}
