"use client";
"use client";
import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useMemo } from "react";
import { getStaff } from "../actions/server";
import { useBulkDeleteStaff } from "../hooks/use-bulk-delete-staff";
import { createStaffTransformer } from "../utils/staff-transformer";
import { useGetStaffColumns } from "./StaffColumns";
import StaffRowDetail from "./StaffRowDetail";

type Props = {
  initialData: Awaited<ReturnType<typeof getStaff>>;
};

export default function RenderStaffData({ initialData }: Props) {
  const columns = useGetStaffColumns();
  const { deletestaff } = useBulkDeleteStaff();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const staffTransformer = useMemo(
    () => createStaffTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  return (
    <>
      {initialData.error ? (
        <ErrorComponent error={initialData.error} />
      ) : initialData.staff === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          showImportButton={true}
          columns={columns}
          data={initialData.staff}
          transformer={staffTransformer}
          filename="Staff-list"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            await deletestaff(ids);
          }}
          renderSubComponent={(row) => <StaffRowDetail row={row} />}
        />
      )}
    </>
  );
}
