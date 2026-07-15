"use client";

import dynamic from "next/dynamic";

const CreateRoleDialog = dynamic(() =>
  import("./CreateRoleDialog").then((mod) => mod.CreateRoleDialog),
);
const EditRoleDialog = dynamic(() =>
  import("./UpdateRoleDialog").then((mod) => mod.UpdateRoleDialog),
);

export const RolesDialogsProvider = () => {
  return (
    <>
      <CreateRoleDialog />
      <EditRoleDialog />
    </>
  );
};
