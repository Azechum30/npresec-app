"use client";

import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkUploadPlacedStudentsAction } from "../_actions/server-only-actions";

export const UploadPlacedStudentsProvider = () => {
  return (
    <UploadComponent
      handleUploadAction={bulkUploadPlacedStudentsAction}
      filepath="students/placement-list.csv"
    />
  );
};
