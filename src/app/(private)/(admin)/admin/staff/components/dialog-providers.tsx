/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import type { UploadProps } from "@/components/customComponents/UploadComponent";
import type { BulkCreateStaffType } from "@/lib/validation";
import dynamic from "next/dynamic";
import type { JSX } from "react";
import { bulkCreateStaff } from "../actions/bulk-create-staff";

const CreateStaffDialog = dynamic(() =>
  import("@/app/(private)/(admin)/admin/staff/components/CreateStaffDialog").then(
    (mod) => mod.default,
  ),
);
const EditStaffDialog = dynamic(() =>
  import("@/app/(private)/(admin)/admin/staff/components/EditStaffDialog").then(
    (mod) => mod.default,
  ),
);
const DynamicBulkUpload = dynamic(() =>
  import("@/components/customComponents/UploadComponent").then(
    (mod) => mod.default,
  ),
);

const BulkUploadStaff = DynamicBulkUpload as <T>(
  props: UploadProps<T>,
) => JSX.Element;

export const StaffDialogsProvider = () => {
  return (
    <>
      <CreateStaffDialog />
      <EditStaffDialog />
      <BulkUploadStaff<BulkCreateStaffType>
        handleUploadAction={bulkCreateStaff}
        filepath="staff/staff-template.csv"
      />
    </>
  );
};
