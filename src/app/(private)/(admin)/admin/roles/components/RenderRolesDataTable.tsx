"use client";

import { RolesResponseType } from "@/lib/types";
import { use } from "react";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import { useGetRolesColumns } from "@/app/(private)/(admin)/admin/roles/hooks/use-get-roles-columns";
import { useHandleBulkRoleDelete } from "@/app/(private)/(admin)/admin/roles/hooks/use-handle-bulk-role-delete";

type RenderRolesDataTableProps = {
  promise: {
    roles: RolesResponseType[];
  };
};

export const RenderRolesDataTable = ({
  promise,
}: RenderRolesDataTableProps) => {
  const columns = useGetRolesColumns();
  const { handleBulkRoleDelete } = useHandleBulkRoleDelete();

  return (
    <>
      <DataTable
        columns={columns}
        data={promise.roles}
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          await handleBulkRoleDelete(ids);
        }}
      />
    </>
  );
};
