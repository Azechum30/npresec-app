"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { useAuth } from "@/components/customComponents/SessionProvider";
import DataTable from "@/components/customComponents/data-table";
import { Notification } from "@/components/customComponents/notification";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getAllUsersAction } from "../_actions/get-all-users-action";
import { RegisterClientSideBackgroundNotifications } from "../_hooks/register-client-side-background-notifications";
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
  const { handleUsersDelete, isDeleteSuccess, userDeleteCount, ...rest } =
    useHandleUsersDelete();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const user = useAuth();

  const userDataTransformer = useMemo(
    () => exportUsersDataTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  useEffect(() => {
    if (rest.isError) {
      toast.error(rest.isError);
      rest.isError = "";
      return;
    }

    if (isDeleteSuccess) {
      toast.success(
        `${userDeleteCount} ${userDeleteCount > 1 || userDeleteCount === 0 ? "users" : "user"} deleted successfully`,
      );
    }
  }, [rest, isDeleteSuccess, userDeleteCount]);

  return (
    <>
      {error ? (
        <ErrorComponent error={error} />
      ) : users === undefined ? (
        <Notification />
      ) : users.length > 0 ? (
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
      ) : (
        <Notification description="No data found from the database server." />
      )}
      <UpdateUserPermissionsDialog />
      <UpdateUserRoleModal />
      <CreateNewUserModal />
      <RegisterClientSideBackgroundNotifications
        userId={user?.id as string}
        eventNames={[
          "Onboarding-email-queue-error",
          "user-onboarding-email-queued",
          "User-email-sending-complete",
          "Error-sending-user-email",
          "rate-limit-exceeded",
          "single-email-server-error",
        ]}
      />
    </>
  );
};
