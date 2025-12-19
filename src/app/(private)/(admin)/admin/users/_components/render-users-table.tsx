"use client";

import { useGetUsersColumns } from "../_hooks/use-get-users-columns";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import DataTable from "@/components/customComponents/data-table";
import { UpdateUserPermissionsDialog } from "./update-user-permissions-dialog";
import { UpdateUserRoleModal } from "./update-user-role-modal";
import { useHandleUsersDelete } from "../_hooks/use-delete-users";
import { useEffect } from "react";
import { toast } from "sonner";
import { CreateNewUserModal } from "./creat-new-user-modal";
import { getAllUsersAction } from "../_actions/get-all-users-action";
import { NoDataFound } from "@/components/customComponents/no-data-found";

type RenderUsersTableProps = {
  users?: Awaited<ReturnType<typeof getAllUsersAction>>["users"];
  error?: string;
};

export const RenderUsersTable = ({ users, error }: RenderUsersTableProps) => {
  const columns = useGetUsersColumns();
  const { handleUsersDelete, isDeleteSuccess, isError, userDeleteCount } =
    useHandleUsersDelete();

  useEffect(() => {
    if (isError) {
      toast.error(isError);
      return;
    }

    if (isDeleteSuccess) {
      toast.success(
        `${userDeleteCount} ${userDeleteCount > 1 || userDeleteCount === 0 ? "users" : "user"} deleted successfully`
      );
    }
  }, [isError, isDeleteSuccess]);

  return (
    <>
      {error ? (
        <ErrorComponent error={error} />
      ) : users === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onDelete={async (rows) => {
            const ids = rows.map((r) => r.original.id);
            await handleUsersDelete({ data: { ids } });
          }}
        />
      )}
      <UpdateUserPermissionsDialog />
      <UpdateUserRoleModal />
      <CreateNewUserModal />
    </>
  );
};
