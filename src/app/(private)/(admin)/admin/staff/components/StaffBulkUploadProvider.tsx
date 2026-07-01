import UploadComponent from "@/components/customComponents/UploadComponent";
import type { BulkCreateStaffType } from "@/lib/validation";
import { bulkCreateStaff } from "../actions/bulk-create-staff";

export default function StaffBulkUploadProvider() {
  return (
    <UploadComponent<BulkCreateStaffType>
      filepath="staff/staff-template.csv"
      handleUploadAction={bulkCreateStaff}
    />
  );
}
