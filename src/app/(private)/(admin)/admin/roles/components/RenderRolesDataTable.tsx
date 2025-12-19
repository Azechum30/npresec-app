"use client";

import { RolesResponseType } from "@/lib/types";
import { use } from "react";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import { useGetRolesColumns } from "@/app/(private)/(admin)/admin/roles/hooks/use-get-roles-columns";
import { useHandleBulkRoleDelete } from "@/app/(private)/(admin)/admin/roles/hooks/use-handle-bulk-role-delete";

type RenderRolesDataTableProps = {
  promise: Promise<{
    roles?: RolesResponseType[];
    error?: string;
  }>;
};

export const RenderRolesDataTable = ({
  promise,
}: RenderRolesDataTableProps) => {
  const columns = useGetRolesColumns();
  const { roles, error } = use(promise);
  const { handleBulkRoleDelete } = useHandleBulkRoleDelete();

  if (!roles) {
    return <LoadingState />;
  }

  if (error) {
    toast.error(error);
    return null;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={roles}
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          await handleBulkRoleDelete(ids);
        }}
      />
    </>
  );
};
