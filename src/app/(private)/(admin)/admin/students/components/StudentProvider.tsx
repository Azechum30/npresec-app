"use client";

import dynamic from "next/dynamic";
import { bulkCreateStudents } from "../actions/action";

const BulkUploadStudentsModal = dynamic(
  () =>
    import("@/components/customComponents/UploadComponent").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

export default function StudentProvider() {
  return (
    <BulkUploadStudentsModal
      filepath="students/students-template.csv"
      handleUploadAction={bulkCreateStudents as any}
    />
  );
}
