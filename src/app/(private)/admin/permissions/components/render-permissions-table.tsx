"use client";

import DataTable from "@/components/customComponents/data-table";
import LoadingState from "@/components/customComponents/Loading";
import { PermissionResponseType } from "@/lib/types";
import { FC, use } from "react";
import { toast } from "sonner";
import { useGetPermissionsColumns } from "../hooks/use-get-permission-columns";

type RenderPermissionTableProps = {
  promise: Promise<{
    permissions?: PermissionResponseType[];
    error?: string;
  }>;
};

export const RenderPermissionsTable: FC<RenderPermissionTableProps> = ({
  promise,
}) => {
  const { error, permissions } = use(promise);
  const columns = useGetPermissionsColumns();

  if (error) {
    return toast.error(error);
  }

  return (
    <>
      {permissions ? (
        <DataTable data={permissions} columns={columns} />
      ) : (
        <LoadingState />
      )}
    </>
  );
};
