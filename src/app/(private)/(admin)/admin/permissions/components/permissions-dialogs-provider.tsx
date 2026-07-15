"use client";

import dynamic from "next/dynamic";

const CreatePermissionModal = dynamic(() =>
  import("./CreatePermissionModal").then((mod) => mod.CreatePermissionModal),
);
const EditPermissionModal = dynamic(() =>
  import("./edit-permission-modal").then((mod) => mod.EditPermissionModal),
);

export const PermissionsDialogsProvider = () => {
  return (
    <>
      <CreatePermissionModal />
      <EditPermissionModal />
    </>
  );
};
