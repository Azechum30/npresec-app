"use client";

import dynamic from "next/dynamic";

const CreateTemplateModal = dynamic(() =>
  import("./render-template-form-modal").then(
    (mod) => mod.RenderTemplateFormModal,
  ),
);
const EditTemplateModal = dynamic(() =>
  import("./edit-template-modal").then((mod) => mod.EditTemplateModal),
);

export const TemplateDialogs = () => {
  return (
    <>
      <CreateTemplateModal />
      <EditTemplateModal />
    </>
  );
};
