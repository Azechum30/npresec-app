"use client";

import dynamic from "next/dynamic";

const RequestExeatModal = dynamic(() =>
  import("./render-student-exeat-request-form").then(
    (mod) => mod.RenderStudentExeatRequest,
  ),
);
const EditExeatRequestModal = dynamic(() =>
  import("./edit-student-exeat-request-modal").then(
    (mod) => mod.EditStudentExeatRequestModal,
  ),
);
const ViewExeatDetailsSheet = dynamic(() =>
  import("./view-exeat-details").then((mod) => mod.ViewExeatDetails),
);

export const ExeatDialogsProvider = () => {
  return (
    <>
      <RequestExeatModal />
      <EditExeatRequestModal />
      <ViewExeatDetailsSheet />
    </>
  );
};
