"use client";

import dynamic from "next/dynamic";

const CreateStudentAttendanceModal = dynamic(
  () =>
    import("@/app/(private)/attendance/components/createAttendanceDialog").then(
      (mod) => mod.CreateAttendanceDialog,
    ),
  { ssr: false },
);

const EditStudentAttendanceModal = dynamic(
  () =>
    import("@/app/(private)/attendance/components/edit-attendance-dialog").then(
      (mod) => mod.EditAttendanceDialog,
    ),
  { ssr: false },
);
const CreateSingleStudentAttendanceModal = dynamic(
  () =>
    import("@/app/(private)/attendance/components/single-student-attendance-dialog").then(
      (mod) => mod.SingleStudentAttendanceDialog,
    ),
  { ssr: false },
);

export const AttendanceDialogsProvider = () => {
  return (
    <>
      <CreateStudentAttendanceModal />
      <CreateSingleStudentAttendanceModal />
      <EditStudentAttendanceModal />
    </>
  );
};
