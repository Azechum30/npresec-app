"use client";

import dynamic from "next/dynamic";

const CreateHouseDialog = dynamic(() =>
  import("./render-create-house-modal").then(
    (mod) => mod.RenderCreateHouseModal,
  ),
);
const EditHouseDialog = dynamic(() =>
  import("./edit-house-modal").then((mod) => mod.EditHouseModal),
);

export const HousesDialogProviders = () => {
  return (
    <>
      <CreateHouseDialog />
      <EditHouseDialog />
    </>
  );
};
