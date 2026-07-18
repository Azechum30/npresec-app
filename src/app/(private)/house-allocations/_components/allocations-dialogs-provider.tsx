"use client";

import dynamic from "next/dynamic";

const CreateAllocationModal = dynamic(() =>
  import("./render-student-house-allocation-modal").then(
    (mod) => mod.StudentHouseAllocationModal,
  ),
);

const EditStudentAllocationModal = dynamic(() =>
  import("./edit-student-allocation-modal").then(
    (mod) => mod.EditStudentAllocationModal,
  ),
);

export const AllocationDialogsProvider = () => {
  return (
    <>
      <CreateAllocationModal />
      <EditStudentAllocationModal />
    </>
  );
};
