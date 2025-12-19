"use client";
"use client";
import { useMemo } from "react";
import { useGetStaffColumns } from "./StaffColumns";
import DataTable from "@/components/customComponents/data-table";
import StaffRowDetail from "./StaffRowDetail";
import { useBulkDeleteStaff } from "../hooks/use-bulk-delete-staff";
import { createStaffTransformer } from "../utils/staff-transformer";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { getStaff } from "../actions/server";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";

type Props = {
  initialData: Awaited<ReturnType<typeof getStaff>>;
};

export default function RenderStaffData({ initialData }: Props) {
  const columns = useGetStaffColumns();
  const { deletestaff } = useBulkDeleteStaff();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const staffTransformer = useMemo(
    () => createStaffTransformer(preferredDateFormat),
    [preferredDateFormat]
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
            const employeeIds = rows.map((row) => row.original.employeeId);
            await deletestaff(ids, employeeIds);
          }}
          renderSubComponent={(row) => <StaffRowDetail row={row} />}
        />
      )}
    </>
  );
}
