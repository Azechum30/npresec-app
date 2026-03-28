"use client";

import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkUploadStudentsScores } from "../_actions/bulk-upload-student-scores";

export const BulkStudentsScoresProvider = () => {
  return (
    <UploadComponent
      handleUploadAction={bulkUploadStudentsScores}
      filepath="scores/scores-template.csv"
    />
  );
};
