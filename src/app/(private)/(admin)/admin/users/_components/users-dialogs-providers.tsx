"use client";

import dynamic from "next/dynamic";

const UpdateUserRoleDialog = dynamic(() =>
  import("./update-user-role-modal").then((mod) => mod.UpdateUserRoleModal),
);
const CreateNewUserDialog = dynamic(() =>
  import("./creat-new-user-modal").then((mod) => mod.CreateNewUserModal),
);
const UpdateUserRolePermissionsDialog = dynamic(() =>
  import("./update-user-permissions-dialog").then(
    (mod) => mod.UpdateUserPermissionsDialog,
  ),
);
const BanUserModal = dynamic(() =>
  import("./ban-user-modal").then((mod) => mod.BanUserModal),
);

export const UsersDialogsProviders = () => {
  return (
    <>
      <CreateNewUserDialog />
      <UpdateUserRoleDialog />
      <UpdateUserRolePermissionsDialog />
      <BanUserModal />
    </>
  );
};
