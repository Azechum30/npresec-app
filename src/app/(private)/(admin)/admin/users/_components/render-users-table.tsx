"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import DataTable from "@/components/customComponents/data-table";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getAllUsersAction } from "../_actions/get-all-users-action";
import { useHandleUsersDelete } from "../_hooks/use-delete-users";
import { useGetUsersColumns } from "../_hooks/use-get-users-columns";
import { exportUsersDataTransformer } from "../_utils/export-users-data-transform";
import { CreateNewUserModal } from "./creat-new-user-modal";
import { UpdateUserPermissionsDialog } from "./update-user-permissions-dialog";
import { UpdateUserRoleModal } from "./update-user-role-modal";

type RenderUsersTableProps = {
  users?: Awaited<ReturnType<typeof getAllUsersAction>>["users"];
  error?: string;
};

export const RenderUsersTable = ({ users, error }: RenderUsersTableProps) => {
  const columns = useGetUsersColumns();
  const { handleUsersDelete, isDeleteSuccess, isError, userDeleteCount } =
    useHandleUsersDelete();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const userDataTransformer = useMemo(
    () => exportUsersDataTransformer(preferredDateFormat),
    [preferredDateFormat]
  );

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
  }, [isError, isDeleteSuccess, userDeleteCount]);

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
          transformer={userDataTransformer}
          filename="users-list"
        />
      )}
      <UpdateUserPermissionsDialog />
      <UpdateUserRoleModal />
      <CreateNewUserModal />
    </>
  );
};
